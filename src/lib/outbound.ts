/** Contest: every outbound click lands on Google. In-page anchors stay local. */
export const OUTBOUND_URL = "https://www.google.com";

export function outboundHref(href: string | undefined | null): string {
  if (!href) return OUTBOUND_URL;
  const value = href.trim();
  if (
    value.startsWith("#") ||
    value.startsWith("/#") ||
    (value.startsWith("/") && !value.startsWith("//"))
  ) {
    return value;
  }
  return OUTBOUND_URL;
}
