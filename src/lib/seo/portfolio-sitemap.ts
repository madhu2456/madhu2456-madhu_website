import type { MetadataRoute } from "next";
import { getPortfolioData } from "@/lib/portfolio-data";
import { resolveSiteUrl } from "@/lib/site-url";

const FALLBACK_LAST_MODIFIED = "2026-06-02";

const toSitemapDate = (value: string | null | undefined, fallback: string) => {
  if (!value) return fallback;
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return fallback;
  return new Date(timestamp).toISOString().split("T")[0];
};

export async function buildPortfolioSitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = `${resolveSiteUrl()}/`;
  const { sortedServices, sortedProjects, portfolioLastUpdatedAt } =
    await getPortfolioData();
  const baseDate = toSitemapDate(
    portfolioLastUpdatedAt,
    FALLBACK_LAST_MODIFIED,
  );

  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: baseDate,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          "x-default": siteUrl,
        },
      },
    },
    {
      url: `${siteUrl}profile/`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}services/`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}case-studies/`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}credentials/`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}contact/`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}ai-consultant-india/`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}privacy/`,
      lastModified: baseDate,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    ...sortedServices.map((service) => ({
      url: `${siteUrl}services/${service.slug}/`,
      lastModified: toSitemapDate(service.updatedAt, baseDate),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...sortedProjects.map((project) => ({
      url: `${siteUrl}case-studies/${project.slug}/`,
      lastModified: toSitemapDate(project.updatedAt, baseDate),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  return entries;
}
