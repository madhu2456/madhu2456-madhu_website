import type { MetadataRoute } from "next";
import { getPortfolioData } from "@/lib/portfolio-data";
import { COMMERCIAL_LANDERS } from "@/lib/seo/commercial-landers";
import { INDIA_SERVICE_ALIASES } from "@/lib/seo/service-aliases";
import { resolveSiteUrl } from "@/lib/site-url";

/** Floor when content has no valid updatedAt timestamps. */
const FALLBACK_LAST_MODIFIED = "2026-07-22";

const toSitemapDate = (value: string | null | undefined, fallback: string) => {
  if (!value) return fallback;
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return fallback;
  return new Date(timestamp).toISOString().split("T")[0];
};

/** Absolute apex URL with trailing slash (except files like resume.pdf). */
export function toCanonicalSitemapUrl(origin: string, path: string): string {
  const base = origin.replace(/\/$/, "");
  if (!path || path === "/") return `${base}/`;
  if (path.endsWith(".pdf") || path.endsWith(".xml") || path.endsWith(".txt")) {
    return `${base}${path.startsWith("/") ? path : `/${path}`}`;
  }
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  return `${base}${withSlash.endsWith("/") ? withSlash : `${withSlash}/`}`;
}

/** India-primary hreflang set (Phase 1.3 / 5.7). */
const languageAlternates = (url: string) => ({
  "en-IN": url,
  en: url,
  "x-default": url,
});

const entry = (
  url: string,
  lastModified: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap[number] => ({
  url,
  lastModified,
  changeFrequency,
  priority,
  alternates: {
    languages: languageAlternates(url),
  },
});

/**
 * Indexable portfolio URLs only (no /cms/, /search/, noindex thin pages).
 * Includes CMS services, case studies, and Phase 5 India landers.
 */
export async function buildPortfolioSitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = resolveSiteUrl().replace(/\/$/, "");
  const siteUrl = `${origin}/`;
  const { sortedServices, sortedProjects, portfolioLastUpdatedAt } =
    await getPortfolioData();

  const baseDate = toSitemapDate(
    portfolioLastUpdatedAt,
    FALLBACK_LAST_MODIFIED,
  );
  // Fresher of CMS-derived max and known content floor (this remediation cycle).
  const effectiveHubDate =
    baseDate >= FALLBACK_LAST_MODIFIED ? baseDate : FALLBACK_LAST_MODIFIED;

  const raw: MetadataRoute.Sitemap = [
    entry(siteUrl, effectiveHubDate, "weekly", 1.0),
    entry(
      toCanonicalSitemapUrl(origin, "/profile/"),
      effectiveHubDate,
      "monthly",
      0.9,
    ),
    entry(
      toCanonicalSitemapUrl(origin, "/services/"),
      effectiveHubDate,
      "monthly",
      0.9,
    ),
    entry(
      toCanonicalSitemapUrl(origin, "/case-studies/"),
      effectiveHubDate,
      "monthly",
      0.85,
    ),
    entry(
      toCanonicalSitemapUrl(origin, "/credentials/"),
      effectiveHubDate,
      "monthly",
      0.7,
    ),
    entry(
      toCanonicalSitemapUrl(origin, "/contact/"),
      effectiveHubDate,
      "monthly",
      0.7,
    ),
    entry(
      toCanonicalSitemapUrl(origin, "/ai-consultant-india/"),
      effectiveHubDate,
      "monthly",
      0.8,
    ),
    entry(
      toCanonicalSitemapUrl(origin, "/privacy/"),
      effectiveHubDate,
      "monthly",
      0.3,
    ),
    // Resume is intentionally indexable (DR-04)
    entry(
      toCanonicalSitemapUrl(origin, "/resume.pdf"),
      effectiveHubDate,
      "yearly",
      0.4,
    ),
    ...sortedServices.map((service) =>
      entry(
        toCanonicalSitemapUrl(origin, `/services/${service.slug}/`),
        toSitemapDate(service.updatedAt, effectiveHubDate),
        "monthly",
        0.85,
      ),
    ),
    // India-intent landers (real pages, not redirects)
    ...INDIA_SERVICE_ALIASES.map((alias) =>
      entry(
        toCanonicalSitemapUrl(origin, `/services/${alias.slug}/`),
        effectiveHubDate,
        "monthly",
        0.85,
      ),
    ),
    // Commercial keyword landers at site root (content strategy)
    ...COMMERCIAL_LANDERS.map((lander) =>
      entry(
        toCanonicalSitemapUrl(origin, `/${lander.slug}/`),
        effectiveHubDate,
        "monthly",
        0.86,
      ),
    ),
    ...sortedProjects.map((project) =>
      entry(
        toCanonicalSitemapUrl(origin, `/case-studies/${project.slug}/`),
        toSitemapDate(project.updatedAt, effectiveHubDate),
        "monthly",
        0.8,
      ),
    ),
  ];

  // Dedupe by loc (last write wins), then stable sort: priority desc, then URL.
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const item of raw) {
    byUrl.set(item.url, item);
  }

  return Array.from(byUrl.values()).sort((a, b) => {
    const pa = a.priority ?? 0;
    const pb = b.priority ?? 0;
    if (pb !== pa) return pb - pa;
    return a.url.localeCompare(b.url);
  });
}

/** Expected static path prefixes for tests / ops checks (no host). */
export const PORTFOLIO_SITEMAP_STATIC_PATHS = [
  "/",
  "/profile/",
  "/services/",
  "/case-studies/",
  "/credentials/",
  "/contact/",
  "/ai-consultant-india/",
  "/ga4-consultant/",
  "/google-analytics-consultant/",
  "/marketing-analytics-consultant/",
  "/privacy/",
  "/resume.pdf",
] as const;
