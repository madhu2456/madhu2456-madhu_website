import { AI_SEARCH_OPTIMIZATION_2026_GUIDE } from "@/lib/content/ai-search-optimization-2026-guide";
import { ATTRIBUTION_AFTER_COOKIES_GUIDE } from "@/lib/content/attribution-after-cookies-guide";
import { CONSENT_MODE_V2_INDIA_GUIDE } from "@/lib/content/consent-mode-v2-india-guide";
import { FRACTIONAL_AI_PLAYBOOK_GUIDE } from "@/lib/content/fractional-ai-playbook-guide";
import { GA4_BIGQUERY_GUIDE } from "@/lib/content/ga4-bigquery-guide";
import { MMM_2026_GUIDE } from "@/lib/content/mmm-2026-guide";
import { RAG_VS_FINE_TUNING_2026_GUIDE } from "@/lib/content/rag-vs-fine-tuning-2026-guide";

export type GuideFeedItem = {
  slug: string;
  path: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
};

/** Canonical catalog of portfolio guide pillars (RSS + discovery). */
export const PORTFOLIO_GUIDES: GuideFeedItem[] = [
  {
    slug: GA4_BIGQUERY_GUIDE.slug,
    path: GA4_BIGQUERY_GUIDE.path,
    title: GA4_BIGQUERY_GUIDE.title,
    description: GA4_BIGQUERY_GUIDE.seoDescription,
    publishedAt: GA4_BIGQUERY_GUIDE.publishedAt,
    updatedAt: GA4_BIGQUERY_GUIDE.updatedAt,
  },
  {
    slug: MMM_2026_GUIDE.slug,
    path: MMM_2026_GUIDE.path,
    title: MMM_2026_GUIDE.title,
    description: MMM_2026_GUIDE.seoDescription,
    publishedAt: MMM_2026_GUIDE.publishedAt,
    updatedAt: MMM_2026_GUIDE.updatedAt,
  },
  {
    slug: ATTRIBUTION_AFTER_COOKIES_GUIDE.slug,
    path: ATTRIBUTION_AFTER_COOKIES_GUIDE.path,
    title: ATTRIBUTION_AFTER_COOKIES_GUIDE.title,
    description: ATTRIBUTION_AFTER_COOKIES_GUIDE.seoDescription,
    publishedAt: ATTRIBUTION_AFTER_COOKIES_GUIDE.publishedAt,
    updatedAt: ATTRIBUTION_AFTER_COOKIES_GUIDE.updatedAt,
  },
  {
    slug: FRACTIONAL_AI_PLAYBOOK_GUIDE.slug,
    path: FRACTIONAL_AI_PLAYBOOK_GUIDE.path,
    title: FRACTIONAL_AI_PLAYBOOK_GUIDE.title,
    description: FRACTIONAL_AI_PLAYBOOK_GUIDE.seoDescription,
    publishedAt: FRACTIONAL_AI_PLAYBOOK_GUIDE.publishedAt,
    updatedAt: FRACTIONAL_AI_PLAYBOOK_GUIDE.updatedAt,
  },
  {
    slug: RAG_VS_FINE_TUNING_2026_GUIDE.slug,
    path: RAG_VS_FINE_TUNING_2026_GUIDE.path,
    title: RAG_VS_FINE_TUNING_2026_GUIDE.title,
    description: RAG_VS_FINE_TUNING_2026_GUIDE.seoDescription,
    publishedAt: RAG_VS_FINE_TUNING_2026_GUIDE.publishedAt,
    updatedAt: RAG_VS_FINE_TUNING_2026_GUIDE.updatedAt,
  },
  {
    slug: CONSENT_MODE_V2_INDIA_GUIDE.slug,
    path: CONSENT_MODE_V2_INDIA_GUIDE.path,
    title: CONSENT_MODE_V2_INDIA_GUIDE.title,
    description: CONSENT_MODE_V2_INDIA_GUIDE.seoDescription,
    publishedAt: CONSENT_MODE_V2_INDIA_GUIDE.publishedAt,
    updatedAt: CONSENT_MODE_V2_INDIA_GUIDE.updatedAt,
  },
  {
    slug: AI_SEARCH_OPTIMIZATION_2026_GUIDE.slug,
    path: AI_SEARCH_OPTIMIZATION_2026_GUIDE.path,
    title: AI_SEARCH_OPTIMIZATION_2026_GUIDE.title,
    description: AI_SEARCH_OPTIMIZATION_2026_GUIDE.seoDescription,
    publishedAt: AI_SEARCH_OPTIMIZATION_2026_GUIDE.publishedAt,
    updatedAt: AI_SEARCH_OPTIMIZATION_2026_GUIDE.updatedAt,
  },
];

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function guidesFeedLastBuildDate(): Date {
  let latest = 0;
  for (const guide of PORTFOLIO_GUIDES) {
    const t = Date.parse(guide.updatedAt || guide.publishedAt);
    if (!Number.isNaN(t) && t > latest) latest = t;
  }
  return new Date(latest || Date.now());
}

export function buildGuidesRssXml(siteUrl: string): string {
  const origin = siteUrl.replace(/\/$/, "");
  const channelLink = `${origin}/guides/ga4-bigquery/`;
  const selfLink = `${origin}/guides/rss.xml`;
  const lastBuild = guidesFeedLastBuildDate().toUTCString();

  const items = [...PORTFOLIO_GUIDES]
    .sort((a, b) => {
      const ta = Date.parse(a.updatedAt || a.publishedAt);
      const tb = Date.parse(b.updatedAt || b.publishedAt);
      return (Number.isNaN(tb) ? 0 : tb) - (Number.isNaN(ta) ? 0 : ta);
    })
    .map((guide) => {
      const link = `${origin}${guide.path.startsWith("/") ? guide.path : `/${guide.path}`}`;
      const pub = new Date(guide.publishedAt).toUTCString();
      return `    <item>
      <title>${escapeXml(guide.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pub}</pubDate>
      <description>${escapeXml(guide.description)}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Madhu Dadi — Guides</title>
    <link>${escapeXml(channelLink)}</link>
    <description>Portfolio guides on GA4/BigQuery, marketing mix modeling, attribution, and fractional AI — by Madhu Dadi.</description>
    <language>en-IN</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${escapeXml(selfLink)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}
