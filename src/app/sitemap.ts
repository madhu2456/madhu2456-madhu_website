import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in"
  ).replace(/\/$/, ""); // strip trailing slash for consistent canonical form

  const [timestamps, projects] = await Promise.all([
    client.fetch<Array<string | null>>(`
      [
        *[_type == "siteSettings"][0]._updatedAt,
        *[_id == "singleton-profile"][0]._updatedAt,
        *[_type == "project"] | order(_updatedAt desc)[0]._updatedAt,
        *[_type == "experience"] | order(_updatedAt desc)[0]._updatedAt,
        *[_type == "service"] | order(_updatedAt desc)[0]._updatedAt,
        *[_type == "education"] | order(_updatedAt desc)[0]._updatedAt,
        *[_type == "certification"] | order(_updatedAt desc)[0]._updatedAt
      ]
    `),
    client.fetch<
      Array<{
        slug?: { current?: string | null } | null;
        _updatedAt?: string | null;
      }>
    >(`*[_type == "project" && defined(slug.current)]{
      slug,
      _updatedAt
    }`),
  ]);

  const validTimestamps = timestamps
    .filter((value): value is string => typeof value === "string")
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()));
  const latestDate =
    validTimestamps.length > 0
      ? new Date(Math.max(...validTimestamps.map((d) => d.getTime())))
      : new Date();

  const blogUrl = `${siteUrl}/blog`;

  const baseEntries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/case-studies`,
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    // Blog — cross-linked from portfolio (same domain, /blog basePath)
    {
      url: blogUrl,
      lastModified: latestDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${blogUrl}/series`,
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${blogUrl}/tags`,
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/llms.txt`,
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/ai-profile.json`,
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/humans.txt`,
      lastModified: latestDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const caseStudyEntries: MetadataRoute.Sitemap = (projects ?? []).flatMap(
    (project) => {
      const slug = project.slug?.current?.trim();
      if (!slug) return [];

      const updatedAt = project._updatedAt ? new Date(project._updatedAt) : null;
      const lastModified =
        updatedAt && !Number.isNaN(updatedAt.getTime()) ? updatedAt : latestDate;

      return [
        {
          url: `${siteUrl}/case-studies/${slug}`,
          lastModified,
          changeFrequency: "monthly" as const,
          priority: 0.8,
        },
      ];
    },
  );

  return [...baseEntries, ...caseStudyEntries];
}
