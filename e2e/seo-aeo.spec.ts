import { expect, test } from "@playwright/test";
import {
  collectPageUrlsFromSitemap,
  isUrlSet,
  isValidSitemapXml,
} from "./helpers/sitemap";

const indexablePaths = [
  "/",
  "/profile/",
  "/contact/",
  "/credentials/",
  "/services/",
  "/case-studies/",
  "/services/rag-consultant-india/",
  "/services/llm-developer-india/",
  "/services/marketing-analytics-consultant-india/",
  "/services/ai-consultant-visakhapatnam/",
  "/case-studies/adticks/",
  "/ai-consultant-india/",
];

test.describe("SEO/AEO pre-deploy checks", () => {
  for (const path of indexablePaths) {
    test(`${path} exposes canonical, robots, and Open Graph image`, async ({
      page,
    }) => {
      // Use domcontentloaded for meta tags (they're in the <head>)
      // networkidle is too slow; load is fine since we only need DOM
      await page.goto(path, { waitUntil: "domcontentloaded" });

      await expect(page.locator("head link[rel='canonical']")).toHaveCount(1);
      await expect(page.locator("head meta[property='og:image']")).toHaveCount(
        1,
      );

      const robotDirectives = await page
        .locator("head meta[name='robots']")
        .evaluateAll((elements) =>
          elements.map((element) => element.getAttribute("content") ?? ""),
        );
      expect(robotDirectives.some((value) => value.includes("index"))).toBe(
        true,
      );
      expect(robotDirectives.some((value) => value.includes("follow"))).toBe(
        true,
      );
    });
  }

  test("homepage exposes fixed SearchAction JSON-LD", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const jsonLd = await page
      .locator("script[type='application/ld+json']")
      .allTextContents();
    const joinedJsonLd = jsonLd.join("\n");

    expect(joinedJsonLd).toContain("search/?q={search_term_string}");
    expect(joinedJsonLd).toContain("blog/search?q={search_term_string}");
    expect(joinedJsonLd).not.toContain('"price":"0');
    expect(joinedJsonLd).not.toContain('["Service","Product"]');
  });

  test("discovery endpoints are crawlable and source-owned", async ({
    request,
  }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBe(true);
    const robotsText = await robots.text();
    expect(robotsText).toContain("Allow: /llms.txt");
    expect(robotsText).not.toContain("Disallow: /search/");
    expect(robotsText).toContain("Sitemap: https://madhudadi.in/sitemap.xml");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    const sitemapText = await sitemap.text();
    expect(isValidSitemapXml(sitemapText)).toBe(true);

    // Local sitemap only (127.0.0.1:3000). Production topology is checked by
    // scripts/seo-smoke-test.mjs against the deployed SITE_URL.
    const pageUrls = await collectPageUrlsFromSitemap(request, "/sitemap.xml");
    expect(
      pageUrls.some((url) => url.includes("/services/rag-consultant-india/")),
    ).toBe(true);
    expect(
      pageUrls.some((url) => url.includes("/services/llm-developer-india/")),
    ).toBe(true);
  });

  test("portfolio child sitemap serves urlset with marker URL", async ({
    request,
  }) => {
    const response = await request.get("/sitemap-portfolio.xml");
    expect(response.ok()).toBe(true);

    const text = await response.text();
    expect(isUrlSet(text)).toBe(true);
    expect(text).toContain("/services/rag-consultant-india/");
    expect(text).toContain("/services/llm-developer-india/");
    expect(text).toContain('hreflang="en-IN"');
  });

  test("markdown twins are reachable and noindex", async ({ request }) => {
    const response = await request.get("/md/");
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"] || "").toMatch(/markdown|plain/);
    expect(response.headers()["x-robots-tag"] || "").toMatch(/noindex/i);
    const body = await response.text();
    expect(body).toContain("Madhu Dadi");
  });

  test("India landers are 200 not redirects", async ({ baseURL }) => {
    expect(baseURL).toBeTruthy();
    for (const path of [
      "/services/llm-developer-india/",
      "/services/marketing-analytics-consultant-india/",
      "/services/ai-consultant-visakhapatnam/",
    ] as const) {
      const res = await fetch(new URL(path, baseURL).toString(), {
        redirect: "manual",
      });
      expect(res.status, path).toBe(200);
    }
  });

  // F-01: legacy /about must land on canonical /profile/.
  // With trailingSlash: true, bare /about first 308s to /about/ (Next built-in),
  // then to /profile/ (middleware or next.config) → 2 hops. /about/ is 1 hop.
  test("/about legacy paths resolve to /profile/", async ({ baseURL }) => {
    expect(baseURL, "Playwright baseURL must be set").toBeTruthy();

    for (const path of ["/about", "/about/"] as const) {
      let url = new URL(path, baseURL).toString();
      let hops = 0;
      let status = 0;
      const locations: string[] = [];

      for (let i = 0; i < 5; i++) {
        const res = await fetch(url, { redirect: "manual" });
        status = res.status;
        if (status >= 300 && status < 400) {
          const loc = res.headers.get("location");
          expect(loc, `${path} missing Location header`).toBeTruthy();
          locations.push(loc as string);
          url = new URL(loc as string, url).toString();
          hops += 1;
          continue;
        }
        break;
      }

      expect(status, `${path} final status`).toBe(200);
      expect(new URL(url).pathname, `${path} final path`).toBe("/profile/");

      if (path === "/about/") {
        expect(hops, `${path} should be a single redirect hop`).toBe(1);
      } else {
        // bare /about: trailingSlash hop + profile redirect
        expect(hops, `${path} hop count`).toBe(2);
        expect(locations[0], `${path} first hop`).toMatch(/\/about\/?$/);
      }
    }
  });
});

test.describe("No-JS crawler visibility", () => {
  test.use({ javaScriptEnabled: false });

  test("homepage keeps primary answer content visible without JavaScript", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("main#main-content")).toHaveCount(1);
    // H1 is the value prop only (brand lives in logo/title); keep legacy
    // variants so older CMS content still passes if temporarily restored.
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Production AI agents|Madhu Dadi|Build reliable AI agents/i,
      }),
    ).toBeVisible();
    await expect(page.getByText("Who is Madhu Dadi?")).toBeVisible();

    const mainBox = await page.locator("main#main-content").boundingBox();
    expect(mainBox?.height ?? 0).toBeGreaterThan(500);
  });
});
