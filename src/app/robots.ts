import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in"
  ).replace(/\/+$/, "");

  return {
    rules: [
      // Standard crawlers — full access except admin/API paths
      {
        userAgent: "*",
        allow: ["/", "/sitemap.xml", "/llms.txt", "/humans.txt"],
        disallow: ["/studio/", "/api/"],
      },
      // AI search engines — explicitly welcomed for GEO
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "anthropic-ai",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
          "Googlebot-Extended",
          "CCBot",
          "Meta-ExternalAgent",
          "Meta-ExternalFetcher",
          "Amazonbot",
        ],
        allow: ["/", "/llms.txt", "/humans.txt"],
        disallow: ["/studio/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
