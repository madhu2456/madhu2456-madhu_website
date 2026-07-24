import { describe, expect, test } from "vitest";
import {
  buildGuidesRssXml,
  escapeXml,
  PORTFOLIO_GUIDES,
} from "@/lib/seo/guides-catalog";

describe("guides RSS catalog", () => {
  test("lists all pillar guides including B3 trio", () => {
    expect(PORTFOLIO_GUIDES.length).toBe(7);
    expect(PORTFOLIO_GUIDES.map((g) => g.slug).sort()).toEqual(
      [
        "ai-search-optimization-2026",
        "attribution-after-cookies",
        "consent-mode-v2-india",
        "fractional-ai-playbook",
        "ga4-bigquery",
        "marketing-mix-modeling-2026",
        "rag-vs-fine-tuning-2026",
      ].sort(),
    );
  });

  test("buildGuidesRssXml is valid-looking RSS 2.0", () => {
    const xml = buildGuidesRssXml("https://madhudadi.in/");
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("application/rss+xml");
    expect(xml).toContain("https://madhudadi.in/guides/rss.xml");
    expect(xml).toContain("<link>https://madhudadi.in/guides/</link>");
    expect(xml).toContain("ai-search-optimization-2026");
    expect(xml).toContain("<item>");
    expect((xml.match(/<item>/g) || []).length).toBe(PORTFOLIO_GUIDES.length);
  });

  test("escapeXml encodes markup", () => {
    expect(escapeXml(`a & b <c> "d"`)).toBe(
      "a &amp; b &lt;c&gt; &quot;d&quot;",
    );
  });
});
