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
      // OpenAI search visibility
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
      // OpenAI trainingbot (GPTBot)
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      // Perplexity search visibility
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      // Anthropic / Claude visibility
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      {
        userAgent: "Claude-SearchBot",
        allow: "/",
      },
      {
        userAgent: "Claude-User",
        allow: "/",
      },
      // Google standard search
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },
      // Google AI controls
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
    ],
    sitemap: [`${siteUrl}sitemap.xml`, `${siteUrl}blog/sitemap.xml`],
  };
}
