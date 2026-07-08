import { describe, expect, test } from "vitest";
import { serializeSitemapXml } from "@/lib/seo/serialize-sitemap-xml";

describe("serializeSitemapXml", () => {
  test("renders a valid urlset with escaped values", () => {
    const xml = serializeSitemapXml([
      {
        url: "https://madhudadi.in/services/rag-consultant-india/",
        lastModified: "2026-06-02",
        changeFrequency: "monthly",
        priority: 0.85,
      },
    ]);

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    );
    expect(xml).toContain(
      "<loc>https://madhudadi.in/services/rag-consultant-india/</loc>",
    );
    expect(xml).toContain("<lastmod>2026-06-02</lastmod>");
    expect(xml).toContain("<changefreq>monthly</changefreq>");
    expect(xml).toContain("<priority>0.85</priority>");
  });

  test("escapes XML entities in URLs", () => {
    const xml = serializeSitemapXml([
      {
        url: "https://example.com/search?q=a&b=1",
      },
    ]);

    expect(xml).toContain("<loc>https://example.com/search?q=a&amp;b=1</loc>");
  });
});
