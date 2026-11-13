const SCROLL_OFFSET = 88;

function findAppScroller(): HTMLElement | null {
  const root = document.getElementById("root");
  if (!root) return null;
  for (const el of root.querySelectorAll<HTMLElement>("div")) {
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

export function scrollToSectionId(
  id: string,
  options?: { behavior?: ScrollBehavior; offset?: number },
) {
  const target = document.getElementById(id);
  if (!target) return;

  const behavior = options?.behavior ?? "smooth";
  const offset = options?.offset ?? SCROLL_OFFSET;
  const scroller = findAppScroller();

  if (scroller) {
    const top =
      target.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top +
      scroller.scrollTop -
      offset;
    scroller.scrollTo({ top: Math.max(0, top), behavior });
  } else {
    target.scrollIntoView({ behavior, block: "start" });
  }

  history.replaceState(null, "", `#${id}`);
}
