import type { MetadataRoute } from "next";
import { getPortfolioData } from "@/lib/portfolio-data";

// Regenerate sitemap at most once per hour.
// On-demand revalidation is also triggered by the CMS import webhook.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { portfolioLastUpdatedAt, sortedProjects } = await getPortfolioData();
  const siteUrl = `${(
    process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in"
  ).replace(/\/+$/, "")}/`;

  const latestDate = new Date(portfolioLastUpdatedAt);

  const baseEntries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}case-studies/`,
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}search`,
      lastModified: latestDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const caseStudyEntries: MetadataRoute.Sitemap = sortedProjects.flatMap(
    (project) => {
      const slug = project.slug?.trim();
      if (!slug) return [];

      const updatedAt = new Date(project.updatedAt);
      const lastModified = !Number.isNaN(updatedAt.getTime())
        ? updatedAt
        : latestDate;

      return [
        {
          url: `${siteUrl}case-studies/${slug}/`,
          lastModified,
          changeFrequency: "monthly" as const,
          priority: 0.8,
        },
      ];
    },
  );

  return [...baseEntries, ...caseStudyEntries];
}
