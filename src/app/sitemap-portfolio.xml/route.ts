import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/portfolio-data";

export const revalidate = 3600;

const DEFAULT_SITE_URL = "https://madhudadi.in";

export async function GET() {
  const { portfolioLastUpdatedAt, sortedProjects } = await getPortfolioData();
  const siteUrl = `${(
    process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
  ).replace(/\/+$/, "")}/`;

  const latestDate = new Date(portfolioLastUpdatedAt);

  const baseEntries = [
    {
      url: siteUrl,
      lastModified: latestDate.toISOString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}case-studies/`,
      lastModified: latestDate.toISOString(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}search/`,
      lastModified: latestDate.toISOString(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const caseStudyEntries = sortedProjects.flatMap((project) => {
    const slug = project.slug?.trim();
    if (!slug) return [];

    const updatedAt = new Date(project.updatedAt);
    const lastModified = !Number.isNaN(updatedAt.getTime())
      ? updatedAt.toISOString()
      : latestDate.toISOString();

    return [
      {
        url: `${siteUrl}case-studies/${slug}/`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.8,
      },
    ];
  });

  const entries = [...baseEntries, ...caseStudyEntries];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
