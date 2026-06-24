import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/portfolio-data";

import { resolveSiteUrl } from "@/lib/site-url";

export async function GET() {
  const siteUrl = `${resolveSiteUrl()}/`;

  const { sortedServices, sortedProjects, portfolioLastUpdatedAt } =
    await getPortfolioData();
  const baseDate = portfolioLastUpdatedAt
    ? new Date(portfolioLastUpdatedAt).toISOString().split("T")[0]
    : "2026-06-02";

  const entries = [
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
      lastModified: service.updatedAt
        ? new Date(service.updatedAt).toISOString().split("T")[0]
        : baseDate,
      changeFrequency: "monthly",
      priority: "0.85",
    })),
    ...sortedProjects.map((project) => ({
      url: `${siteUrl}case-studies/${project.slug}/`,
      lastModified: project.updatedAt
        ? new Date(project.updatedAt).toISOString().split("T")[0]
        : baseDate,
      changeFrequency: "monthly",
      priority: "0.8",
    })),
  ];

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
