import { expect, test } from "@playwright/test";

const indexablePaths = [
  "/",
  "/profile/",
  "/contact/",
  "/credentials/",
  "/in/",
  "/services/",
  "/case-studies/",
  "/services/rag-consultant-india/",
  "/case-studies/adticks/",
];

test.describe("SEO/AEO pre-deploy checks", () => {
  for (const path of indexablePaths) {
    test(`${path} exposes canonical, robots, and Open Graph image`, async ({
      page,
    }) => {
      await page.goto(path);

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
    await page.goto("/");
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
    expect(sitemapText).toContain("<sitemapindex");
    expect(sitemapText).toContain("/sitemap-portfolio.xml");

    const portfolioSitemap = await request.get("/sitemap-portfolio.xml");
    expect(portfolioSitemap.ok()).toBe(true);
    const portfolioSitemapText = await portfolioSitemap.text();
    expect(portfolioSitemapText).toContain("<urlset");
    expect(portfolioSitemapText).toContain("/services/rag-consultant-india/");
    expect(portfolioSitemapText).not.toContain(
      "<loc>https://madhudadi.in/sitemap-portfolio.xml</loc>",
    );
  });
});

test.describe("No-JS crawler visibility", () => {
  test.use({ javaScriptEnabled: false });

  test("homepage keeps primary answer content visible without JavaScript", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.locator("main#main-content")).toHaveCount(1);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Madhu Dadi|Build reliable AI agents/i,
      }),
    ).toBeVisible();
    await expect(page.getByText("Who is Madhu Dadi?")).toBeVisible();

    const mainBox = await page.locator("main#main-content").boundingBox();
    expect(mainBox?.height ?? 0).toBeGreaterThan(500);
  });
});
