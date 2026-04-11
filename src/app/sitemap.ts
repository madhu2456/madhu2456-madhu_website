import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in"
  ).replace(/\/$/, ""); // strip trailing slash for consistent canonical form

  const timestamps = await client.fetch<Array<string | null>>(`
    [
      *[_type == "siteSettings"][0]._updatedAt,
      *[_id == "singleton-profile"][0]._updatedAt,
      *[_type == "project"] | order(_updatedAt desc)[0]._updatedAt,
      *[_type == "experience"] | order(_updatedAt desc)[0]._updatedAt,
      *[_type == "service"] | order(_updatedAt desc)[0]._updatedAt,
      *[_type == "education"] | order(_updatedAt desc)[0]._updatedAt,
      *[_type == "certification"] | order(_updatedAt desc)[0]._updatedAt
    ]
  `);

  const validTimestamps = timestamps
    .filter((value): value is string => typeof value === "string")
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()));
  const latestDate =
    validTimestamps.length > 0
      ? new Date(Math.max(...validTimestamps.map((d) => d.getTime())))
      : new Date();

  return [
    {
      url: siteUrl,
      lastModified: latestDate,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
