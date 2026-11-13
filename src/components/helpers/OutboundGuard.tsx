import { useEffect } from "react";
import { OUTBOUND_URL, outboundHref } from "@/lib/outbound";

/**
 * Forces every external <a> to open Google.
 * Capture-phase click handler covers dynamic / markdown / API links.
 */
export function OutboundGuard() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const next = outboundHref(href);
      if (next === href) return;

      event.preventDefault();
      event.stopPropagation();
      window.open(OUTBOUND_URL, anchor.target || "_blank", "noopener,noreferrer");
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
