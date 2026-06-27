import { NextResponse } from "next/server";
import { buildPortfolioSitemapXml } from "@/lib/seo/portfolio-sitemap";

export async function GET() {
  const xml = await buildPortfolioSitemapXml();

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
