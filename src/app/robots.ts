import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in";

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
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "anthropic-ai",
          "Claude-Web",
          "PerplexityBot",
          "Googlebot-Extended",
          "Applebot-Extended",
          "Gemini",
          "YouBot",
          "CCBot",
          "Cisco-AIBot",
          "Meta-ExternalAgent",
          "Meta-ExternalFetcher",
          "Amazonbot",
        ],
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
