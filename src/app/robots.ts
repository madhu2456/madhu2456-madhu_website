import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in"
  ).replace(/\/+$/, "");
  const siteHost = (() => {
    try {
      return new URL(siteUrl).host;
    } catch {
      return siteUrl.replace(/^https?:\/\//, "");
    }
  })();

  return {
    rules: [
      // Standard crawlers — full access except admin/API paths
      {
        userAgent: "*",
        allow: [
          "/",
          "/blog",
          "/blog/",
          "/case-studies",
          "/sitemap.xml",
          "/llms.txt",
          "/ai-profile.json",
          "/humans.txt",
        ],
        disallow: ["/studio/", "/api/"],
      },
      // AI search engines — explicitly welcomed for GEO
      {
        userAgent: [
          // OpenAI
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          // Anthropic
          "anthropic-ai",
          "ClaudeBot",
          "Claude-Web",
          // Perplexity
          "PerplexityBot",
          // Google AI
          "Google-Extended",
          "Googlebot-Extended",
          // Apple
          "Applebot",
          "Applebot-Extended",
          // Meta / Facebook
          "Meta-ExternalAgent",
          "Meta-ExternalFetcher",
          "facebookexternalhit",
          // Amazon
          "Amazonbot",
          // Common Crawl (used by many AI training pipelines)
          "CCBot",
          // ByteDance / TikTok
          "Bytespider",
          // Cohere
          "cohere-ai",
          // Diffbot (knowledge graph / AI)
          "Diffbot",
          // You.com AI search
          "YouBot",
          // Brave Search
          "BraveBot",
        ],
        allow: [
          "/",
          "/blog",
          "/blog/",
          "/case-studies",
          "/llms.txt",
          "/ai-profile.json",
          "/humans.txt",
        ],
        disallow: ["/studio/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteHost,
  };
}
