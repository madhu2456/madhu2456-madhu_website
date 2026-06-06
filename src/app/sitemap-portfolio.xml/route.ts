import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/portfolio-data";

export const revalidate = 3600;

const DEFAULT_SITE_URL = "https://madhudadi.in";

export async function GET() {
  const siteUrl = `${(
    process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
  ).replace(/\/+$/, "")}/`;
  
  const { sortedServices, sortedProjects } = await getPortfolioData();

  const entries = [
    {
      url: siteUrl,
      lastModified: "2026-06-02",
      changeFrequency: "weekly",
      priority: "1.0",
    },
    {
      url: `${siteUrl}profile/`,
      lastModified: "2026-06-02",
      changeFrequency: "monthly",
      priority: "0.9",
    },
    {
      url: `${siteUrl}services/`,
      lastModified: "2026-06-02",
      changeFrequency: "monthly",
      priority: "0.9",
    },
    {
      url: `${siteUrl}resume.pdf`,
      lastModified: "2026-06-02",
      changeFrequency: "monthly",
      priority: "0.5",
    },
    ...sortedServices.map(service => ({
      url: `${siteUrl}services/${service.slug}/`,
      lastModified: service.updatedAt ? new Date(service.updatedAt).toISOString().split('T')[0] : "2026-06-02",
      changeFrequency: "monthly",
      priority: "0.85",
    })),
    ...sortedProjects.map(project => ({
      url: `${siteUrl}case-studies/${project.slug}/`,
      lastModified: project.updatedAt ? new Date(project.updatedAt).toISOString().split('T')[0] : "2026-06-02",
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
