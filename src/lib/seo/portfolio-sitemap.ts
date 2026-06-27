import { getPortfolioData } from "@/lib/portfolio-data";
import { resolveSiteUrl } from "@/lib/site-url";

type SitemapEntry = {
  url: string;
  lastModified: string;
  changeFrequency: "weekly" | "monthly";
  priority: string;
};

const FALLBACK_LAST_MODIFIED = "2026-06-02";

const toSitemapDate = (value: string | null | undefined, fallback: string) => {
  if (!value) return fallback;
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return fallback;
  return new Date(timestamp).toISOString().split("T")[0];
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const renderAlternateTags = (entryUrl: string, siteUrl: string) => {
  if (entryUrl === siteUrl) {
    return `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(
      siteUrl,
    )}" />`;
  }

  return "";
};

export async function buildPortfolioSitemapXml() {
  const siteUrl = `${resolveSiteUrl()}/`;
  const { sortedServices, sortedProjects, portfolioLastUpdatedAt } =
    await getPortfolioData();
  const baseDate = toSitemapDate(
    portfolioLastUpdatedAt,
    FALLBACK_LAST_MODIFIED,
  );

  const entries: SitemapEntry[] = [
    {
      url: siteUrl,
      lastModified: baseDate,
      changeFrequency: "weekly",
      priority: "1.0",
    },
    {
      url: `${siteUrl}profile/`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: "0.9",
    },
    {
      url: `${siteUrl}services/`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: "0.9",
    },
    {
      url: `${siteUrl}case-studies/`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: "0.85",
    },
    {
      url: `${siteUrl}credentials/`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: "0.7",
    },
    {
      url: `${siteUrl}contact/`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: "0.7",
    },
    ...sortedServices.map((service) => ({
      url: `${siteUrl}services/${service.slug}/`,
      lastModified: toSitemapDate(service.updatedAt, baseDate),
      changeFrequency: "monthly" as const,
      priority: "0.85",
    })),
    ...sortedProjects.map((project) => ({
      url: `${siteUrl}case-studies/${project.slug}/`,
      lastModified: toSitemapDate(project.updatedAt, baseDate),
      changeFrequency: "monthly" as const,
      priority: "0.8",
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
  .map((entry) => {
    const alternateTags = renderAlternateTags(entry.url, siteUrl);

    return `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${escapeXml(entry.lastModified)}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>${alternateTags}
  </url>`;
  })
  .join("\n")}
</urlset>`;
}
