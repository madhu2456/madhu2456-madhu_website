import type { MetadataRoute } from "next";

import { resolveSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = `${resolveSiteUrl()}/`;

  return {
    rules: [
      // Standard crawlers with admin/private route disallows
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/cms/",
          "/api/cms/",
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
          "Meta-ExternalAgent",
          "Diffbot",
          "YouBot",
          "Amazonbot",
          "Bytespider",
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
