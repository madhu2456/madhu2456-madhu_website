import { buildPortfolioSitemap } from "@/lib/seo/portfolio-sitemap";
import { serializeSitemapXml } from "@/lib/seo/serialize-sitemap-xml";

export const dynamic = "force-dynamic";

export async function GET() {
  const entries = await buildPortfolioSitemap();
  const body = serializeSitemapXml(entries);

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
