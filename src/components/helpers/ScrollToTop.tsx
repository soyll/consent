import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function findAppScroller(): HTMLElement | null {
  const root = document.getElementById("root");
  if (!root) return null;
  const nodes = root.querySelectorAll<HTMLElement>("div");
  for (const el of nodes) {
    const style = window.getComputedStyle(el);
    if (
      (style.overflowY === "auto" || style.overflowY === "scroll") &&
      el.scrollHeight > el.clientHeight + 1
    ) {
      return el;
    }
  }
  return null;
}

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const scroller = findAppScroller();
    const id = hash.replace(/^#/, "");

    if (id) {
      const frame = requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (!target) return;
        if (scroller) {
          const top =
            target.getBoundingClientRect().top -
            scroller.getBoundingClientRect().top +
            scroller.scrollTop -
            88;
          scroller.scrollTo({ top: Math.max(0, top) });
        } else {
          target.scrollIntoView();
        }
      });
      return () => cancelAnimationFrame(frame);
    }

    if (scroller) scroller.scrollTo(0, 0);
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
