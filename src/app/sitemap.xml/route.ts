import { NextResponse } from "next/server";

export const revalidate = 3600;

const DEFAULT_SITE_URL = "https://madhudadi.in";

export async function GET() {
  const siteUrl = `${(
    process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
  ).replace(/\/+$/, "")}/`;

  // Use the current time for the sitemap index lastmod
  const lastmod = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${siteUrl}sitemap-portfolio.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${siteUrl}blog/sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
