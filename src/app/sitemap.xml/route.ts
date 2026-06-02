import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/portfolio-data";

export const revalidate = 3600;

const DEFAULT_SITE_URL = "https://madhudadi.in";

export async function GET() {
  const { portfolioLastUpdatedAt, sortedProjects, sortedServices } =
    await getPortfolioData();
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
      url: `${siteUrl}profile/`,
      lastModified: latestDate.toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}services/`,
      lastModified: latestDate.toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}case-studies/`,
      lastModified: latestDate.toISOString(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}credentials/`,
      lastModified: latestDate.toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}contact/`,
      lastModified: latestDate.toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
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

  const serviceEntries = sortedServices.flatMap((service) => {
    const slug = service.slug?.trim();
    if (!slug) return [];

    const updatedAt = new Date(service.updatedAt);
    const lastModified = !Number.isNaN(updatedAt.getTime())
      ? updatedAt.toISOString()
      : latestDate.toISOString();

    return [
      {
        url: `${siteUrl}services/${slug}/`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.85,
      },
    ];
  });

  const entries = [...baseEntries, ...caseStudyEntries, ...serviceEntries];

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
