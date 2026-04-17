import type { MetadataRoute } from "next";
import { getPortfolioData } from "@/lib/portfolio-data";

// Regenerate sitemap at most once per hour.
// On-demand revalidation is also triggered by the CMS import webhook.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { portfolioLastUpdatedAt, sortedProjects } = await getPortfolioData();
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in"
  ).replace(/\/$/, "");

  const latestDate = new Date(portfolioLastUpdatedAt);
  const blogUrl = `${siteUrl}/blog`;

  const baseEntries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/case-studies`,
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: blogUrl,
      lastModified: latestDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${blogUrl}/series`,
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${blogUrl}/tags`,
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // Blog sub-site pages (crawlers benefit from seeing these in the portfolio sitemap)
    {
      url: `${blogUrl}/posts`,
      lastModified: latestDate,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${blogUrl}/ask`,
      lastModified: latestDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Machine-readable endpoints — important for AI/LLM crawlers
    {
      url: `${siteUrl}/llms.txt`,
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/ai-profile.json`,
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/humans.txt`,
      lastModified: latestDate,
      changeFrequency: "monthly",
      priority: 0.5,
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
          url: `${siteUrl}/case-studies/${slug}`,
          lastModified,
          changeFrequency: "monthly" as const,
          priority: 0.8,
        },
      ];
    },
  );

  return [...baseEntries, ...caseStudyEntries];
}
