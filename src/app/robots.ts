import type { MetadataRoute } from "next";

import { resolveSiteUrl } from "@/lib/site-url";

const PRIVATE_DISALLOWS = [
  "/cms/",
  "/api/",
  "/studio/",
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
];

const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "anthropic-ai",
  "ClaudeBot",
  "Claude-Web",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "perplexity-user",
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
  "Amazonbot",
  "Bytespider",
];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = `${resolveSiteUrl()}/`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep /search/ crawlable so bots can see the page-level noindex,follow tag.
        disallow: PRIVATE_DISALLOWS,
      },
      {
        userAgent: ["bingbot", "adidxbot", "slurp"],
        allow: "/",
        disallow: PRIVATE_DISALLOWS,
        crawlDelay: 1,
      },
      {
        userAgent: AI_CRAWLERS,
        allow: [
          "/",
          "/llms.txt",
          "/llms-full.txt",
          "/ai-profile.json",
          "/humans.txt",
          "/blog/",
          "/blog/posts",
          "/blog/series",
          "/blog/tags",
          "/blog/ask",
          "/blog/llms.txt",
          "/blog/llms-full.txt",
          "/blog/ai-profile.json",
          "/blog/api/og",
          "/.well-known/ai-plugin.json",
        ],
        disallow: PRIVATE_DISALLOWS,
      },
    ],
    sitemap: [`${siteUrl}sitemap.xml`, `${siteUrl}blog/sitemap.xml`],
  };
}
