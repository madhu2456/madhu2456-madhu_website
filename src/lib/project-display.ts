/**
 * Project-specific internal link label (audit: avoid identical "Read case study"
 * anchors sitewide). Prefer the short brand/head of the title.
 */
export function getCaseStudyLinkLabel(title: string, maxLen = 40): string {
  const raw = title?.trim() || "Case study";
  const head =
    raw
      .split(/\s+[—–-]\s+/)
      .find((part) => part.trim().length > 0)
      ?.trim() || raw;
  const short =
    head.length > maxLen ? `${head.slice(0, maxLen - 1).trimEnd()}…` : head;
  if (/case\s*stud(y|ies)/i.test(short)) return short;
  return `${short} case study`;
}

/**
 * Returns a card tagline only when it adds information beyond the title.
 * Avoids "Title: Adticks - Real-time …" followed by the same "Real-time …" line.
 */
export function getDistinctProjectTagline(
  title: string,
  tagline?: string | null,
): string | null {
  const t = title?.trim() ?? "";
  const g = tagline?.trim() ?? "";
  if (!g) return null;
  if (!t) return g;
  if (t === g) return null;

  const normalize = (value: string) =>
    value.toLowerCase().replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

  const nt = normalize(t);
  const ng = normalize(g);
  if (nt === ng) return null;
  if (nt.endsWith(ng) || nt.includes(` - ${ng}`) || nt.includes(`: ${ng}`)) {
    return null;
  }
  if (ng.includes(nt) && ng.length - nt.length < 12) return null;

  return g;
}
