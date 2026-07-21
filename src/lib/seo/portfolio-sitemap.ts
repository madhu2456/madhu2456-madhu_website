import type { MetadataRoute } from "next";
import { getPortfolioData } from "@/lib/portfolio-data";
import { INDIA_SERVICE_ALIASES } from "@/lib/seo/service-aliases";
import { resolveSiteUrl } from "@/lib/site-url";

const FALLBACK_LAST_MODIFIED = "2026-06-02";

const toSitemapDate = (value: string | null | undefined, fallback: string) => {
  if (!value) return fallback;
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return fallback;
  return new Date(timestamp).toISOString().split("T")[0];
};

/** India-primary hreflang set for every sitemap URL (Phase 1.3 / 5.7). */
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

export async function buildPortfolioSitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = `${resolveSiteUrl()}/`;
  const { sortedServices, sortedProjects, portfolioLastUpdatedAt } =
    await getPortfolioData();
  const baseDate = toSitemapDate(
    portfolioLastUpdatedAt,
    FALLBACK_LAST_MODIFIED,
  );

  const entries: MetadataRoute.Sitemap = [
    entry(siteUrl, baseDate, "weekly", 1.0),
    entry(`${siteUrl}profile/`, baseDate, "monthly", 0.9),
    entry(`${siteUrl}services/`, baseDate, "monthly", 0.9),
    entry(`${siteUrl}case-studies/`, baseDate, "monthly", 0.85),
    entry(`${siteUrl}credentials/`, baseDate, "monthly", 0.7),
    entry(`${siteUrl}contact/`, baseDate, "monthly", 0.7),
    entry(`${siteUrl}ai-consultant-india/`, baseDate, "monthly", 0.8),
    entry(`${siteUrl}privacy/`, baseDate, "monthly", 0.3),
    ...sortedServices.map((service) =>
      entry(
        `${siteUrl}services/${service.slug}/`,
        toSitemapDate(service.updatedAt, baseDate),
        "monthly",
        0.85,
      ),
    ),
    // India-intent landers (real pages, not redirects)
    ...INDIA_SERVICE_ALIASES.map((alias) =>
      entry(`${siteUrl}services/${alias.slug}/`, baseDate, "monthly", 0.85),
    ),
    ...sortedProjects.map((project) =>
      entry(
        `${siteUrl}case-studies/${project.slug}/`,
        toSitemapDate(project.updatedAt, baseDate),
        "monthly",
        0.8,
      ),
    ),
  ];

  return entries;
}
