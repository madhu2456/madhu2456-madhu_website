import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/portfolio-data";
import { resolveSiteUrl } from "@/lib/site-url";

const toSitemapDate = (value: string | null | undefined) => {
  if (!value) return new Date().toISOString().split("T")[0];
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return new Date().toISOString().split("T")[0];
  return new Date(timestamp).toISOString().split("T")[0];
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const siteUrl = `${resolveSiteUrl()}/`;
  const { portfolioLastUpdatedAt } = await getPortfolioData();
  const lastModified = toSitemapDate(portfolioLastUpdatedAt);

  const sitemaps = [
    {
      loc: `${siteUrl}sitemap-portfolio.xml`,
      lastModified,
    },
    {
      loc: `${siteUrl}blog/sitemap.xml`,
      lastModified,
    },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (sitemap) => `  <sitemap>
    <loc>${escapeXml(sitemap.loc)}</loc>
    <lastmod>${escapeXml(sitemap.lastModified)}</lastmod>
  </sitemap>`,
  )
  .join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
