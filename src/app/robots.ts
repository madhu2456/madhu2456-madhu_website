import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = `${(
    process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in"
  ).replace(/\/+$/, "")}/`;

  return {
    rules: [
      // Standard crawlers with admin/private route disallows
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/search/",
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
      // AI Search & Chatbot visibility
      {
        userAgent: [
          "OAI-SearchBot",
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "perplexity-user",
          "ClaudeBot",
          "Claude-SearchBot",
          "Claude-User",
          "anthropic-ai",
          "Google-Extended",
          "Applebot-Extended",
          "omny-ai",
        ],
        allow: "/",
      },
      // Google standard search
      {
        userAgent: ["Googlebot", "Googlebot-Image"],
        allow: "/",
      },
    ],
    sitemap: [`${siteUrl}sitemap.xml`, `${siteUrl}blog/sitemap.xml`],
  };
}
