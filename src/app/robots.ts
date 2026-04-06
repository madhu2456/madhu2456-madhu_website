import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.com";

  return {
    rules: [
      // Standard crawlers — full access except admin/API paths
      {
        userAgent: "*",
        allow: ["/", "/sitemap.xml", "/llms.txt"],
        disallow: ["/studio/", "/api/draft-mode/"],
      },
      // AI search engines — explicitly welcomed for GEO
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
      {
        userAgent: "Googlebot-Extended",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
      {
        userAgent: "Gemini",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
