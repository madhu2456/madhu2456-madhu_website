import type { MetadataRoute } from "next";
import { buildPortfolioSitemap } from "@/lib/seo/portfolio-sitemap";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildPortfolioSitemap();
}
