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

const AI_SEARCH_AND_CITATION_CRAWLERS = [
  "OAI-SearchBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Applebot",
  "facebookexternalhit",
  "BraveBot",
];

const USER_TRIGGERED_FETCHERS = [
  "ChatGPT-User",
  "Claude-User",
  "Claude-Web",
  "Perplexity-User",
  "perplexity-user",
  "Meta-ExternalFetcher",
];

const PUBLIC_DISCOVERY_ALLOWS = [
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
        userAgent: AI_SEARCH_AND_CITATION_CRAWLERS,
        allow: PUBLIC_DISCOVERY_ALLOWS,
        disallow: PRIVATE_DISALLOWS,
      },
      {
        userAgent: USER_TRIGGERED_FETCHERS,
        allow: PUBLIC_DISCOVERY_ALLOWS,
        disallow: PRIVATE_DISALLOWS,
      },
    ],
    sitemap: [`${siteUrl}sitemap.xml`, `${siteUrl}blog/sitemap.xml`],
  };
}
