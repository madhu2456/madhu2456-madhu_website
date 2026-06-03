import { NextResponse } from "next/server";

export const revalidate = 3600;

const DEFAULT_SITE_URL = "https://madhudadi.in";

export async function GET() {
  const siteUrl = `${(
    process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
  ).replace(/\/+$/, "")}/`;

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
      url: `${siteUrl}services/ai-llm-application-development/`,
      lastModified: "2026-06-02",
      changeFrequency: "monthly",
      priority: "0.85",
    },
    {
      url: `${siteUrl}services/rag-consultant-india/`,
      lastModified: "2026-06-02",
      changeFrequency: "monthly",
      priority: "0.85",
    },
    {
      url: `${siteUrl}services/ai-agent-development/`,
      lastModified: "2026-06-02",
      changeFrequency: "monthly",
      priority: "0.85",
    },
    {
      url: `${siteUrl}services/marketing-analytics-consultant/`,
      lastModified: "2026-06-02",
      changeFrequency: "monthly",
      priority: "0.85",
    },
    {
      url: `${siteUrl}services/ga4-bigquery-campaign-analytics/`,
      lastModified: "2026-06-02",
      changeFrequency: "monthly",
      priority: "0.85",
    },
    {
      url: `${siteUrl}services/full-stack-ai-product-development/`,
      lastModified: "2026-06-02",
      changeFrequency: "monthly",
      priority: "0.85",
    },
    {
      url: `${siteUrl}case-studies/`,
      lastModified: "2026-06-02",
      changeFrequency: "monthly",
      priority: "0.85",
    },
    {
      url: `${siteUrl}case-studies/adticks/`,
      lastModified: "2026-06-02",
      changeFrequency: "monthly",
      priority: "0.8",
    },
    {
      url: `${siteUrl}case-studies/technical-blog/`,
      lastModified: "2026-06-02",
      changeFrequency: "monthly",
      priority: "0.8",
    },
    {
      url: `${siteUrl}case-studies/udemy-enroller-fastapi/`,
      lastModified: "2026-06-02",
      changeFrequency: "monthly",
      priority: "0.8",
    },
    {
      url: `${siteUrl}credentials/`,
      lastModified: "2026-06-02",
      changeFrequency: "monthly",
      priority: "0.7",
    },
    {
      url: `${siteUrl}contact/`,
      lastModified: "2026-06-02",
      changeFrequency: "monthly",
      priority: "0.7",
    },
    {
      url: `${siteUrl}llms.txt`,
      lastModified: "2026-06-02",
      changeFrequency: "monthly",
      priority: "0.5",
    },
    {
      url: `${siteUrl}ai-profile.json`,
      lastModified: "2026-06-02",
      changeFrequency: "monthly",
      priority: "0.5",
    },
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
