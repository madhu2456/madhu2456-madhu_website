import type { MetadataRoute } from "next";

// Keep this date updated whenever you make meaningful content changes.
// Using a static date (instead of new Date()) is critical — a sitemap
// that shows a new lastmod on every request tells Google the page changes
// constantly, which destroys crawl trust and lastmod signal reliability.
const LAST_UPDATED = new Date("2025-01-01");

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in"
  ).replace(/\/$/, ""); // strip trailing slash for consistent canonical form

  return [
    {
      // Homepage — the single canonical URL for this single-page portfolio
      url: `${siteUrl}/`,
      lastModified: LAST_UPDATED,
      // "monthly" is honest for a portfolio; "weekly" makes Google
      // expect frequent updates that never come, reducing crawl trust.
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
