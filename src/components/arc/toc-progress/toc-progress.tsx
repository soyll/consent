import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { animate, motionValue, type AnimationPlaybackControls } from "motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  buildPathPoints,
  laneX,
  lengthAtY,
  pointAtLength,
  pointsToPathD,
  svgWidth,
  type LanePoint,
} from "./path";
import {
  clamp,
  computeReadingProgress,
  estimateReadingMinutes,
  findScrollParent,
  getScrollMetrics,
  headingContentTop,
  progressToLength,
  wordsInElement,
} from "./scroll-progress";
import styles from "./toc-progress.module.css";

export type TocProgressItem = {
  id: string;
  label: string;
  level?: 1 | 2 | 3;
};

export type TocProgressProps = {
  items: TocProgressItem[];
  scrollContainer?: RefObject<HTMLElement | null> | HTMLElement | null;
  offset?: number;
  activeId?: string;
  onActiveChange?: (id: string) => void;
  onNavigate?: (id: string) => void;
  readingTime?: number;
  title?: string;
  showTimeLeft?: boolean;
  label?: string;
  className?: string;
  style?: CSSProperties;
};

type RowState = "read" | "current" | "ahead";

// Critically damped: damping ≈ 2 * sqrt(stiffness * mass) — no overshoot.
const SPRING = { type: "spring" as const, stiffness: 280, damping: 34, mass: 1 };
const SNAPPY = { type: "spring" as const, stiffness: 520, damping: 46, mass: 0.8 };
const WORDS_PER_MINUTE = 230;
const MARKER_R = 3.5;
const KNOCKOUT_R = 5.5;

function resolveContainer(
  scrollContainer: TocProgressProps["scrollContainer"],
  firstHeading: HTMLElement | null,
): HTMLElement | Window {
  if (scrollContainer) {
    if (typeof scrollContainer === "object" && "current" in scrollContainer) {
      if (scrollContainer.current) return scrollContainer.current;
    } else if (scrollContainer instanceof HTMLElement) {
      return scrollContainer;
    }
  }
  return findScrollParent(firstHeading);
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function focusHeading(el: HTMLElement) {
  const prev = el.getAttribute("tabindex");
  if (prev === null) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

export function TocProgress({
  items,
  scrollContainer,
  offset = 96,
  activeId: activeIdProp,
  onActiveChange,
  onNavigate,
  readingTime: readingTimeProp,
  title = "На этой странице",
  showTimeLeft = true,
  label = "На этой странице",
  className,
  style,
}: TocProgressProps) {
  const titleId = useId();
  const maskId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const knockoutRef = useRef<SVGCircleElement>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const [pathD, setPathD] = useState("");
  const [svgHeight, setSvgHeight] = useState(0);
  const [uncontrolledActive, setUncontrolledActive] = useState(
    items[0]?.id ?? "",
  );
  const [minutesLeft, setMinutesLeft] = useState<number | "done">(
    readingTimeProp ?? 1,
  );
  const [totalMinutes, setTotalMinutes] = useState(readingTimeProp ?? 1);
  const [pendingId, setPendingIdState] = useState<string | null>(null);
  const pendingIdRef = useRef<string | null>(null);
  const setPendingId = useCallback((id: string | null) => {
    pendingIdRef.current = id;
    setPendingIdState(id);
  }, []);
  const prevMinutesRef = useRef<number | "done">(readingTimeProp ?? 1);

  const itemLengthsRef = useRef<number[]>([]);
  const totalLengthRef = useRef(0);
  const headingTopsRef = useRef<number[]>([]);
  const progressValue = useRef(motionValue(0));
  const animRef = useRef<AnimationPlaybackControls | null>(null);
  const rafScrollRef = useRef(0);
  const activeRef = useRef(items[0]?.id ?? "");
  const reducedRef = useRef(false);
  const navigatingToRef = useRef<string | null>(null);
  const navTargetScrollRef = useRef<number | null>(null);
  const navTimeoutRef = useRef<number | null>(null);
  const updateFromScrollRef = useRef<() => void>(() => {});
  const measureGeometryRef = useRef<() => void>(() => {});
  const measureHeadingsRef = useRef<() => void>(() => {});
  const offsetRef = useRef(offset);
  offsetRef.current = offset;

  const isControlled = activeIdProp !== undefined;
  const activeId = isControlled ? activeIdProp! : uncontrolledActive;
  // During click-navigation, keep the chosen item current in the UI even if
  // live scroll samples briefly disagree.
  const displayActiveId = pendingId ?? activeId;

  const setActive = useCallback(
    (id: string) => {
      if (activeRef.current === id) return;
      activeRef.current = id;
      if (!isControlled) setUncontrolledActive(id);
      onActiveChange?.(id);
    },
    [isControlled, onActiveChange],
  );

  const applyVisual = useCallback((length: number) => {
    const track = trackRef.current;
    const progress = progressRef.current;
    const marker = markerRef.current;
    const knockout = knockoutRef.current;
    if (!track || !progress || !marker) return;
    if (!track.getAttribute("d")) return;

    const total = totalLengthRef.current || track.getTotalLength();
    if (!Number.isFinite(total) || total <= 0) return;
    const len = clamp(length, 0, total);
    const pt = pointAtLength(track, len);

    progress.setAttribute("stroke-dasharray", `${len.toFixed(2)} 100000`);
    progress.style.opacity = len > 0.5 ? "1" : "0";
    marker.setAttribute(
      "transform",
      `translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)})`,
    );
    knockout?.setAttribute(
      "transform",
      `translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)})`,
    );
  }, []);

  const springTo = useCallback(
    (targetLength: number) => {
      animRef.current?.stop();
      if (reducedRef.current) {
        progressValue.current.set(targetLength);
        applyVisual(targetLength);
        return;
      }
      animRef.current = animate(progressValue.current, targetLength, {
        ...SPRING,
        onUpdate: (v) => applyVisual(v),
      });
    },
    [applyVisual],
  );

  const measureGeometry = useCallback(() => {
    const list = listRef.current;
    if (!list || items.length === 0) return;

    const rows = Array.from(list.querySelectorAll<HTMLLIElement>("[data-level]"));
    const listRect = list.getBoundingClientRect();
    const centers: LanePoint[] = [];

    rows.forEach((row, i) => {
      const item = items[i];
      if (!item) return;
      const level = (item.level ?? 1) as 1 | 2 | 3;
      const rect = row.getBoundingClientRect();
      const y = rect.top - listRect.top + rect.height / 2;
      centers.push({ x: laneX(level), y, level });
    });

    const height = Math.ceil(listRect.height);
    const endY = Math.max(
      centers[centers.length - 1]?.y ?? 0,
      height - 4,
    );
    const points = buildPathPoints(centers, endY);
    const d = pointsToPathD(points);
    setPathD(d);
    setSvgHeight(height);

    // Defer length cache until path is in the DOM with new `d`.
    requestAnimationFrame(() => {
      const pathEl = trackRef.current;
      if (!pathEl || !d) return;
      const total = pathEl.getTotalLength();
      totalLengthRef.current = total;
      itemLengthsRef.current = centers.map((c) =>
        lengthAtY(pathEl, c.y, total),
      );
      // Keep progress path in sync
      if (progressRef.current) {
        progressRef.current.setAttribute("d", d);
      }
      applyVisual(progressValue.current.get());
    });
  }, [items, applyVisual]);

  const measureHeadings = useCallback(() => {
    const first = document.getElementById(items[0]?.id ?? "");
    const container = resolveContainer(scrollContainer, first);
    const metrics = getScrollMetrics(container);

    // Missing / not-yet-mounted sections (lazy) must NOT use 0 — that makes
    // them look already scrolled past and jumps the marker to the end.
    headingTopsRef.current = items.map((item) => {
      const el = document.getElementById(item.id);
      if (!el) return Number.POSITIVE_INFINITY;
      return headingContentTop(
        el,
        container,
        metrics.contentTop,
        metrics.scrollTop,
      );
    });

    if (readingTimeProp == null) {
      const source =
        container === window
          ? document.scrollingElement
          : (container as HTMLElement);
      const minutes = estimateReadingMinutes(
        wordsInElement(source),
        WORDS_PER_MINUTE,
      );
      setTotalMinutes(minutes);
    } else {
      setTotalMinutes(readingTimeProp);
    }
  }, [items, scrollContainer, readingTimeProp]);

  const updateFromScroll = useCallback(() => {
    const first = document.getElementById(items[0]?.id ?? "");
    const container = resolveContainer(scrollContainer, first);
    const metrics = getScrollMetrics(container);

    // Always remeasure: lazy sections mount after the first pass, and Bend's
    // scroller can change contentTop as the page moves.
    measureHeadings();

    const progress = computeReadingProgress(
      headingTopsRef.current,
      metrics.scrollTop,
      metrics.maxScroll,
      offset,
      metrics.viewportHeight,
    );

    const idx = clamp(
      Math.floor(progress),
      0,
      Math.max(0, items.length - 1),
    );
    const nextId = items[idx]?.id;
    const locked = navigatingToRef.current;
    const navTarget = navTargetScrollRef.current;

    // While a chosen heading is scrolling into place, keep marker on the
    // destination spring and ignore intermediate scroll samples.
    if (locked != null && navTarget != null) {
      const arrived =
        Math.abs(metrics.scrollTop - navTarget) <= 8 ||
        metrics.scrollTop >= metrics.maxScroll - 1;
      if (!arrived) {
        return;
      }

      // Only release the UI lock once the reading line agrees with the
      // chosen heading (or we truly can't scroll further and it is the
      // closest reachable section).
      const lockedIndex = items.findIndex((item) => item.id === locked);
      const agrees = nextId === locked;
      const atBottom = metrics.scrollTop >= metrics.maxScroll - 1;
      if (!agrees && !atBottom) {
        return;
      }

      navigatingToRef.current = null;
      navTargetScrollRef.current = null;
      if (navTimeoutRef.current != null) {
        window.clearTimeout(navTimeoutRef.current);
        navTimeoutRef.current = null;
      }

      if (agrees) {
        setPendingId(null);
      } else if (atBottom && lockedIndex >= 0) {
        // Heading cannot reach the offset line — keep it current and park
        // the marker on its row instead of jumping to a later section.
        const dest =
          itemLengthsRef.current[lockedIndex] ??
          progressToLength(
            lockedIndex,
            itemLengthsRef.current,
            totalLengthRef.current,
          );
        springTo(dest);
        setActive(locked);
        // pendingId stays until the user scrolls away.
        return;
      } else {
        setPendingId(null);
      }
    }

    // Manual scroll while a click-lock leftover is still pending: drop it.
    const pending = pendingIdRef.current;
    if (
      pending &&
      navigatingToRef.current == null &&
      nextId &&
      nextId !== pending
    ) {
      const pendingTop =
        headingTopsRef.current[items.findIndex((item) => item.id === pending)];
      if (
        pendingTop != null &&
        Math.abs(metrics.scrollTop + offset - pendingTop) > 48
      ) {
        setPendingId(null);
      }
    }

    const targetLen = progressToLength(
      progress,
      itemLengthsRef.current,
      totalLengthRef.current,
    );
    springTo(targetLen);
    if (nextId) setActive(nextId);

    if (showTimeLeft) {
      const full = Math.max(1, items.length);
      const t = clamp(progress / full, 0, 1);
      let next: number | "done";
      if (t >= 0.995 || metrics.scrollTop >= metrics.maxScroll - 1) {
        next = "done";
      } else {
        next = Math.max(1, Math.ceil(totalMinutes * (1 - t)));
      }

      if (prevMinutesRef.current !== next) {
        prevMinutesRef.current = next;
        setMinutesLeft(next);
      }
    }
  }, [
    items,
    scrollContainer,
    offset,
    springTo,
    setActive,
    setPendingId,
    showTimeLeft,
    totalMinutes,
    measureHeadings,
  ]);

  updateFromScrollRef.current = updateFromScroll;
  measureGeometryRef.current = measureGeometry;
  measureHeadingsRef.current = measureHeadings;

  // Geometry observers
  useLayoutEffect(() => {
    measureGeometryRef.current();
    measureHeadingsRef.current();
  }, [items, scrollContainer]);

  useEffect(() => {
    reducedRef.current = prefersReducedMotion();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => {
      reducedRef.current = mq.matches;
    };
    mq.addEventListener("change", onMq);

    const list = listRef.current;
    const first = document.getElementById(items[0]?.id ?? "");
    const container = resolveContainer(scrollContainer, first);

    const observed = new Set<Element>();
    const ro = new ResizeObserver(() => {
      measureGeometryRef.current();
      measureHeadingsRef.current();
      updateFromScrollRef.current();
    });
    const observeEl = (el: Element | null) => {
      if (!el || observed.has(el)) return;
      observed.add(el);
      ro.observe(el);
    };
    if (list) observeEl(list);
    if (rootRef.current) observeEl(rootRef.current);
    if (container !== window) observeEl(container as HTMLElement);

    const observeHeadings = () => {
      items.forEach((item) => {
        observeEl(document.getElementById(item.id));
      });
    };
    observeHeadings();

    // Lazy sections mount later — pick them up for resize + remasure.
    const mo = new MutationObserver(() => {
      observeHeadings();
      measureHeadingsRef.current();
      updateFromScrollRef.current();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const onScroll = () => {
      if (rafScrollRef.current) return;
      rafScrollRef.current = requestAnimationFrame(() => {
        rafScrollRef.current = 0;
        updateFromScrollRef.current();
      });
    };

    const scrollTarget: Window | HTMLElement =
      container === window ? window : (container as HTMLElement);
    scrollTarget.addEventListener("scroll", onScroll, { passive: true });

    // Fonts can reflow row heights.
    document.fonts?.ready?.then(() => {
      measureGeometryRef.current();
      measureHeadingsRef.current();
      updateFromScrollRef.current();
    });

    updateFromScrollRef.current();
    const unsub = progressValue.current.on("change", (v) => applyVisual(v));

    return () => {
      mq.removeEventListener("change", onMq);
      ro.disconnect();
      mo.disconnect();
      scrollTarget.removeEventListener("scroll", onScroll);
      if (rafScrollRef.current) cancelAnimationFrame(rafScrollRef.current);
      if (navTimeoutRef.current != null) {
        window.clearTimeout(navTimeoutRef.current);
        navTimeoutRef.current = null;
      }
      animRef.current?.stop();
      unsub();
    };
    // Intentionally stable: scroll/resize handlers read latest logic via refs.
    // Re-subscribing on every render was killing in-flight spring animations.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, scrollContainer]);

  useEffect(() => {
    activeRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    if (readingTimeProp != null) setTotalMinutes(readingTimeProp);
  }, [readingTimeProp]);

  const scrollToId = useCallback(
    (id: string) => {
      onNavigate?.(id);

      const el = document.getElementById(id);
      if (!el) return;

      // Refresh heading cache so target scroll uses current layout.
      measureHeadingsRef.current();

      const container = resolveContainer(scrollContainer, el);
      const metrics = getScrollMetrics(container);
      const top = headingContentTop(
        el,
        container,
        metrics.contentTop,
        metrics.scrollTop,
      );
      // Land the heading on the offset reading line (top of the reading area).
      const target = Math.max(
        0,
        Math.min(metrics.maxScroll, top - offsetRef.current),
      );

      navigatingToRef.current = id;
      navTargetScrollRef.current = target;
      setPendingId(id);
      setActive(id);

      const index = items.findIndex((item) => item.id === id);
      const lengths = itemLengthsRef.current;
      if (index >= 0) {
        const dest =
          lengths.length > index
            ? (lengths[index] ?? 0)
            : progressToLength(index, lengths, totalLengthRef.current);
        // Trace the path straight to the chosen heading — not via live scroll.
        springTo(dest);
      }

      const reduced = reducedRef.current;
      if (container === window) {
        window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
      } else {
        (container as HTMLElement).scrollTo({
          top: target,
          behavior: reduced ? "auto" : "smooth",
        });
      }

      // Focus after scroll starts; preventScroll avoids a second jump.
      requestAnimationFrame(() => focusHeading(el));

      if (navTimeoutRef.current != null) {
        window.clearTimeout(navTimeoutRef.current);
      }
      // Safety: release the lock if scroll never reports arrival.
      navTimeoutRef.current = window.setTimeout(() => {
        if (navigatingToRef.current === id) {
          navigatingToRef.current = null;
          navTargetScrollRef.current = null;
          setPendingId(null);
          updateFromScrollRef.current();
        }
        navTimeoutRef.current = null;
      }, 1600);
    },
    [onNavigate, scrollContainer, setActive, setPendingId, items, springTo],
  );

  const onLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault();
    scrollToId(id);
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLOListElement>) => {
    const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    const links = linkRefs.current.filter(Boolean) as HTMLAnchorElement[];
    if (links.length === 0) return;
    const current = document.activeElement;
    let index = links.findIndex((l) => l === current);
    if (index < 0) index = 0;

    if (event.key === "ArrowDown") index = Math.min(links.length - 1, index + 1);
    if (event.key === "ArrowUp") index = Math.max(0, index - 1);
    if (event.key === "Home") index = 0;
    if (event.key === "End") index = links.length - 1;
    links[index]?.focus();
  };

  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === displayActiveId),
  );

  const navLabel = title || label;
  const showTitle = Boolean(title);

  // Rolling time label
  const timeLabel =
    minutesLeft === "done"
      ? "Готово"
      : minutesLeft <= 0
        ? `осталось ${totalMinutes} мин`
        : `осталось ${minutesLeft} мин`;

  return (
    <nav
      ref={rootRef}
      className={cn(styles.root, className)}
      style={style}
      aria-labelledby={showTitle ? titleId : undefined}
      aria-label={showTitle ? undefined : navLabel}
    >
      {(showTitle || showTimeLeft) && (
        <div className={styles.head}>
          {showTitle ? (
            <p id={titleId} className={styles.title}>
              {title}
            </p>
          ) : (
            <span />
          )}
          {showTimeLeft && (
            <span
              className={styles.time}
              data-done={minutesLeft === "done" ? "" : undefined}
              aria-hidden="true"
            >
              <TimeRoll
                key={String(minutesLeft)}
                reduced={reducedRef.current}
              >
                {minutesLeft === "done" ? (
                  <>
                    Finished
                    <Check aria-hidden="true" />
                  </>
                ) : (
                  timeLabel
                )}
              </TimeRoll>
            </span>
          )}
        </div>
      )}

      <div className={styles.body}>
        <svg
          className={styles.line}
          width={svgWidth()}
          height={svgHeight || 1}
          viewBox={`0 0 ${svgWidth()} ${svgHeight || 1}`}
          aria-hidden="true"
        >
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x={-8}
            y={-8}
            width={svgWidth() + 16}
            height={(svgHeight || 1) + 16}
          >
            <rect
              x={-8}
              y={-8}
              width={svgWidth() + 16}
              height={(svgHeight || 1) + 16}
              fill="#fff"
            />
            <circle ref={knockoutRef} r={KNOCKOUT_R} fill="#000" />
          </mask>
          <g mask={`url(#${maskId})`}>
            <path ref={trackRef} className={styles.track} d={pathD} />
            <path
              ref={progressRef}
              className={styles.progress}
              d={pathD}
              strokeDasharray="0 100000"
              style={{ opacity: 0 }}
            />
          </g>
          <g ref={markerRef} transform="translate(0 0)">
            <circle r={MARKER_R} className={styles.markerDot} />
          </g>
        </svg>

        <ol
          ref={listRef}
          className={styles.list}
          onKeyDown={onListKeyDown}
        >
          {items.map((item, index) => {
            const level = item.level ?? 1;
            let state: RowState = "ahead";
            if (index < activeIndex) state = "read";
            else if (index === activeIndex) state = "current";

            return (
              <li
                key={item.id}
                className={styles.row}
                data-level={level}
                data-state={state}
              >
                <a
                  ref={(el) => {
                    linkRefs.current[index] = el;
                  }}
                  href={`#${item.id}`}
                  className={styles.link}
                  aria-current={state === "current" ? "location" : undefined}
                  onClick={(e) => onLinkClick(e, item.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      scrollToId(item.id);
                    }
                  }}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

function TimeRoll({
  children,
  reduced,
}: {
  children: ReactNode;
  reduced: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const controls = animate(
      el,
      { opacity: [0, 1], filter: ["blur(4px)", "blur(0px)"], y: [4, 0] },
      { ...SNAPPY, duration: 0.28 },
    );
    return () => controls.stop();
  }, [reduced]);

  return (
    <span ref={ref} className={styles.timeText}>
      {children}
    </span>
  );
}

export default TocProgress;
