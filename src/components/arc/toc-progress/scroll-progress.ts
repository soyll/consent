/** Reading-position math for TocProgress. */

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/**
 * Continuous reading progress as sectionIndex + fraction through that section.
 * Range: [0, headings.length] where the final unit covers the tip past the
 * last heading through max scroll.
 *
 * Uses a fixed `offset` reading line. Headings that can never reach that line
 * (typical for the final Contact block) ease in only as scroll approaches the
 * bottom — and at maxScroll the last item is always active.
 */
export function computeReadingProgress(
  headingTops: number[],
  scrollTop: number,
  maxScroll: number,
  offset: number,
  _viewportHeight: number,
): number {
  const n = headingTops.length;
  if (n === 0) return 0;
  if (maxScroll <= 0) return scrollTop > 0 ? n : 0;

  // Pinned at the end: always the last TOC item (e.g. Contact).
  if (scrollTop >= maxScroll - 1) return n - 1;

  const readY = scrollTop + offset;
  const firstTop = headingTops[0];
  if (!Number.isFinite(firstTop) || readY <= firstTop) return 0;

  for (let i = 0; i < n - 1; i++) {
    const currTop = headingTops[i];
    const nextTop = headingTops[i + 1];
    if (!Number.isFinite(nextTop)) return i;
    if (!Number.isFinite(currTop)) continue;

    // Next heading can never sit on the offset line — ease through the
    // remaining items only while approaching maxScroll.
    const nextTrigger = nextTop - offset;
    if (nextTrigger > maxScroll) {
      const start = Math.max(0, currTop - offset);
      const t = clamp(
        (scrollTop - start) / Math.max(1, maxScroll - start),
        0,
        1,
      );
      return i + t * (n - 1 - i);
    }

    if (readY < nextTop) {
      const span = nextTop - currTop;
      const frac = span <= 0 ? 1 : clamp((readY - currTop) / span, 0, 1);
      return i + frac;
    }
  }

  // Last heading has crossed the offset line — ease marker through the tip.
  const lastTop = headingTops[n - 1];
  if (!Number.isFinite(lastTop)) return Math.max(0, n - 2);
  const start = Math.max(0, lastTop - offset);
  if (scrollTop <= start) return n - 1;
  if (maxScroll <= start) return n - 1;
  return (
    n - 1 + clamp((scrollTop - start) / Math.max(1, maxScroll - start), 0, 1)
  );
}

/** Map continuous progress onto cached path lengths at each item (+ tip). */
export function progressToLength(
  progress: number,
  itemLengths: number[],
  totalLength: number,
): number {
  const n = itemLengths.length;
  if (n === 0) return 0;
  const positions = [...itemLengths, totalLength];
  const maxP = n;
  const p = clamp(progress, 0, maxP);
  if (p >= maxP) return totalLength;
  const i = Math.floor(p);
  const f = p - i;
  const a = positions[i] ?? 0;
  const b = positions[i + 1] ?? totalLength;
  return a + f * (b - a);
}

export function wordsInElement(el: Element | null): number {
  if (!el) return 0;
  const text = el.textContent ?? "";
  const parts = text.trim().split(/\s+/).filter(Boolean);
  return parts.length;
}

export function estimateReadingMinutes(wordCount: number, wpm = 230): number {
  if (wordCount <= 0) return 1;
  return Math.max(1, Math.ceil(wordCount / wpm));
}

export function findScrollParent(el: Element | null): HTMLElement | Window {
  if (!el) return window;
  let node: Element | null = el;
  while (node && node !== document.body && node !== document.documentElement) {
    const style = window.getComputedStyle(node);
    const oy = style.overflowY;
    if (
      (oy === "auto" || oy === "scroll" || oy === "overlay") &&
      (node as HTMLElement).scrollHeight > (node as HTMLElement).clientHeight + 1
    ) {
      return node as HTMLElement;
    }
    node = node.parentElement;
  }
  return window;
}

export function getScrollMetrics(container: HTMLElement | Window): {
  scrollTop: number;
  maxScroll: number;
  viewportHeight: number;
  contentTop: number;
} {
  if (container === window) {
    const se = document.scrollingElement ?? document.documentElement;
    return {
      scrollTop: se.scrollTop,
      maxScroll: Math.max(0, se.scrollHeight - se.clientHeight),
      viewportHeight: se.clientHeight,
      contentTop: 0,
    };
  }
  const el = container as HTMLElement;
  return {
    scrollTop: el.scrollTop,
    maxScroll: Math.max(0, el.scrollHeight - el.clientHeight),
    viewportHeight: el.clientHeight,
    contentTop: el.getBoundingClientRect().top,
  };
}

/** Heading top relative to the scroll content origin. */
export function headingContentTop(
  heading: HTMLElement,
  container: HTMLElement | Window,
  contentTop: number,
  scrollTop: number,
): number {
  const rect = heading.getBoundingClientRect();
  if (container === window) {
    return rect.top + scrollTop;
  }
  return rect.top - contentTop + scrollTop;
}
