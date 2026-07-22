const META_DESC_MAX = 160;

/**
 * Hard-cap meta description length (including ellipsis) for SERP safety.
 */
export function clampMetaDescription(
  value: string,
  maxLen = META_DESC_MAX,
): string {
  const text = value.replace(/\s+/g, " ").trim();
  if (!text) return text;
  if (text.length <= maxLen) return text;

  const sentenceBoundary = text.lastIndexOf(".", maxLen);
  if (sentenceBoundary >= Math.min(80, maxLen - 20)) {
    return text.slice(0, sentenceBoundary + 1).trim();
  }

  const ellipsis = "...";
  const budget = maxLen - ellipsis.length;
  const boundary = text.lastIndexOf(" ", budget);
  const safeBoundary = boundary > 40 ? boundary : budget;
  return `${text
    .slice(0, safeBoundary)
    .trim()
    .replace(/[,\s;:!?-]+$/u, "")}${ellipsis}`;
}

/**
 * Case-study meta description: lead with impact metrics when present,
 * then short context. Always ≤160 characters.
 */
export function buildCaseStudyMetaDescription(project: {
  title?: string | null;
  tagline?: string | null;
  impactSummary?: string | null;
  impactMetrics?: Array<{
    value?: string | null;
    label?: string | null;
  }> | null;
}): string {
  const brand =
    getCaseStudyLinkLabel(project.title || "Case study", 28).replace(
      /\s+case study$/i,
      "",
    ) || "Case study";

  const metrics = (project.impactMetrics ?? [])
    .map((m) => {
      const value = m.value?.trim() ?? "";
      const label = m.label?.trim() ?? "";
      if (!value || !label) return null;
      return `${value} ${label}`.replace(/\s+/g, " ");
    })
    .filter((line): line is string => Boolean(line))
    .slice(0, 2);

  if (metrics.length > 0) {
    const outcome = metrics.join(" · ");
    const tag = project.tagline?.trim();
    // Prefer compact outcome-first line; drop long prose.
    const primary = `${brand}: ${outcome}.`;
    if (tag && primary.length + tag.length + 1 <= META_DESC_MAX) {
      return clampMetaDescription(`${primary} ${tag}`);
    }
    return clampMetaDescription(primary);
  }

  const parts = [project.tagline, project.impactSummary]
    .map((v) => v?.trim())
    .filter((v): v is string => Boolean(v));
  const merged = parts.join(" - ").replace(/\s+/g, " ").trim();
  if (!merged) {
    return "Case study detailing implementation approach, stack, and measurable delivery outcomes.";
  }
  return clampMetaDescription(merged);
}

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
