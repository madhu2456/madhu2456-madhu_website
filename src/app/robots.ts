import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = `${(
    process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in"
  ).replace(/\/+$/, "")}/`;

  const getDomain = () => {
    try {
      return new URL(siteUrl).host;
    } catch {
      return siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
    }
  };

  const siteHost = getDomain();

  return {
    rules: [
      // Standard crawlers — consolidate blog and portfolio crawl controls
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/studio/",
          "/api/",
          "/blog/admin/",
          "/blog/api/v1/admin/",
          "/blog/api/v1/auth/",
          "/blog/api/v1/payments/",
          "/blog/login",
          "/blog/register",
          "/blog/profile/",
          "/blog/bookmarks",
          "/blog/auth",
          "/cdn-cgi/",
        ],
      },
      // Bing / Yahoo minimal crawl delay to protect server performance
      {
        userAgent: ["bingbot", "adidxbot", "slurp"],
        crawlDelay: 1,
      },
      // AI search engines — explicitly welcomed for GEO indexing with safe boundaries
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
          "Googlebot-Extended",
          "Applebot",
          "Applebot-Extended",
          "Meta-ExternalAgent",
          "Meta-ExternalFetcher",
          "facebookexternalhit",
          "cohere-ai",
          "Diffbot",
          "YouBot",
          "BraveBot",
        ],
        allow: [
          "/blog/api/og",
          "/blog",
          "/blog/posts",
          "/blog/series",
          "/blog/tags",
          "/blog/ask",
          "/blog/llms.txt",
          "/blog/llms-full.txt",
          "/blog/ai-profile.json",
          "/llms.txt",
          "/llms-full.txt",
        ],
        disallow: [
          "/blog/admin",
          "/blog/profile",
          "/blog/bookmarks",
          "/blog/auth",
          "/blog/login",
          "/blog/register",
          "/blog/api/v1/auth",
          "/blog/api/v1/admin",
          "/blog/api/v1/payments",
          "/studio/",
          "/api/",
          "/cdn-cgi/",
        ],
      },
    ],
    sitemap: [
      `${siteUrl}sitemap.xml`,
      `${siteUrl}blog/sitemap.xml`,
      `${siteUrl}blog/api/v1/sitemap-index.xml`,
    ],
    host: siteHost,
  };
}
