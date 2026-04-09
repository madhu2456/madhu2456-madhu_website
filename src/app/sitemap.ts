import { client } from "@/sanity/lib/client";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in"
  ).replace(/\/$/, ""); // strip trailing slash for consistent canonical form

  // Fetch the latest modification dates from all major content types
  // to provide Google with a truly accurate 'lastmod' signal.
  const timestamps = await client.fetch<string[]>(`
    [
      *[_id == "singleton-profile"][0]._updatedAt,
      *[_type == "project"] | order(_updatedAt desc)[0]._updatedAt,
      *[_type == "blog"] | order(_updatedAt desc)[0]._updatedAt,
      *[_type == "experience"] | order(_updatedAt desc)[0]._updatedAt
    ]
  `);

  // Filter out nulls and get the most recent one
  const validTimestamps = timestamps.filter(Boolean).map(t => new Date(t));
  const latestDate = validTimestamps.length > 0
    ? new Date(Math.max(...validTimestamps.map(d => d.getTime())))
    : new Date();

  return [
    {
      // Homepage — the single canonical URL for this single-page portfolio
      url: `${siteUrl}/`,
      lastModified: latestDate,
      // "monthly" is honest for a portfolio; "weekly" makes Google
      // expect frequent updates that never come, reducing crawl trust.
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
