import { describe, expect, test } from "vitest";
import { COMMERCIAL_LANDERS } from "@/lib/seo/commercial-landers";
import {
  buildPortfolioSitemap,
  PORTFOLIO_SITEMAP_STATIC_PATHS,
  toCanonicalSitemapUrl,
} from "@/lib/seo/portfolio-sitemap";
import { serializeSitemapXml } from "@/lib/seo/serialize-sitemap-xml";
import { INDIA_SERVICE_ALIASES } from "@/lib/seo/service-aliases";

describe("toCanonicalSitemapUrl", () => {
  test("forces trailing slash on pages", () => {
    expect(toCanonicalSitemapUrl("https://madhudadi.in", "/services")).toBe(
      "https://madhudadi.in/services/",
    );
    expect(toCanonicalSitemapUrl("https://madhudadi.in/", "/")).toBe(
      "https://madhudadi.in/",
    );
  });

  test("keeps file URLs without trailing slash", () => {
    expect(toCanonicalSitemapUrl("https://madhudadi.in", "/resume.pdf")).toBe(
      "https://madhudadi.in/resume.pdf",
    );
  });
});

describe("buildPortfolioSitemap", () => {
  test("includes hubs, all CMS services, India landers, and case studies", async () => {
    const entries = await buildPortfolioSitemap();
    const locs = entries.map((e) => e.url);

    // No duplicates
    expect(new Set(locs).size).toBe(locs.length);

    // Apex only, no www
    for (const loc of locs) {
      expect(loc.startsWith("https://madhudadi.in")).toBe(true);
      expect(loc.includes("www.")).toBe(false);
    }

    for (const path of PORTFOLIO_SITEMAP_STATIC_PATHS) {
      const full =
        path === "/"
          ? "https://madhudadi.in/"
          : path.startsWith("/")
            ? `https://madhudadi.in${path}`
            : `https://madhudadi.in/${path}`;
      expect(locs).toContain(full);
    }

    for (const alias of INDIA_SERVICE_ALIASES) {
      expect(locs).toContain(`https://madhudadi.in/services/${alias.slug}/`);
    }

    for (const lander of COMMERCIAL_LANDERS) {
      expect(locs).toContain(`https://madhudadi.in/${lander.slug}/`);
    }

    // Must not index thin/auth surfaces
    expect(locs.some((u) => u.includes("/cms"))).toBe(false);
    expect(locs.some((u) => u.includes("/search"))).toBe(false);

    // Every entry has lastmod + hreflang
    for (const e of entries) {
      expect(e.lastModified).toBeTruthy();
      expect(e.alternates?.languages?.["en-IN"]).toBe(e.url);
      expect(e.alternates?.languages?.en).toBe(e.url);
      expect(e.alternates?.languages?.["x-default"]).toBe(e.url);
    }

    // Sorted by priority desc
    for (let i = 1; i < entries.length; i++) {
      expect(entries[i - 1].priority ?? 0).toBeGreaterThanOrEqual(
        entries[i].priority ?? 0,
      );
    }

    const xml = serializeSitemapXml(entries);
    expect(xml).toContain("xmlns:xhtml=");
    expect(xml).toContain("/services/rag-consultant-india/");
    expect(xml).toContain("/services/llm-developer-india/");
    expect(xml).toContain("/resume.pdf");
  });
});
