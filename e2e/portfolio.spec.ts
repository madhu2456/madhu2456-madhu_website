import { expect, test } from "@playwright/test";

test.describe("Portfolio Audit UI Checks", () => {
  test("Home page should not have nested <main> tags", async ({ page }) => {
    await page.goto("/");

    // Check that there is exactly one <main> element on the page
    const mainElements = await page.locator("main").count();
    expect(mainElements).toBe(1);

    // Check that the single main element is the primary wrapper
    // The previous implementation had <main id="main-content"> in page.tsx
    // inside the layout's <main>, causing nested main tags.
    // Ensure the home page renders correctly without error.
    await expect(page.locator("text=Madhu Dadi").first()).toBeVisible();
  });

  test("Contact page FAQ rendering correctly from schema", async ({ page }) => {
    await page.goto("/contact");

    // The FAQ questions were extracted to a map in the fix
    // We should expect the definitions list <dl> and terms <dt> to be present
    const faqTerms = page.locator("dt");

    // There are 4 FAQs in the schema, we expect to see at least 4 items
    const count = await faqTerms.count();
    expect(count).toBeGreaterThanOrEqual(4);

    // Check if the FAQ answers are rendered
    const faqAnswers = page.locator("dd");
    const answerCount = await faqAnswers.count();
    expect(answerCount).toBeGreaterThanOrEqual(4);

    // Check visibility of a known FAQ question
    await expect(
      page.locator("text=What is your typical turnaround time?"),
    ).toBeVisible();
  });

  test("Contact form enforces required and email validation", async ({
    page,
  }) => {
    await page.goto("/contact");

    const form = page.locator("form", {
      has: page.getByRole("button", { name: "Send message" }),
    });
    const name = form.locator("#contact-page-name");
    const email = form.locator("#contact-page-email");
    const subject = form.locator("#contact-page-subject");
    const message = form.locator("#contact-page-message");

    await form.getByRole("button", { name: "Send message" }).click();

    await expect(name).toHaveJSProperty("validity.valueMissing", true);
    await expect(email).toHaveJSProperty("validity.valueMissing", true);
    await expect(subject).toHaveJSProperty("validity.valueMissing", true);
    await expect(message).toHaveJSProperty("validity.valueMissing", true);

    await name.fill("Test Visitor");
    await email.fill("not-an-email");
    await subject.fill("Portfolio inquiry");
    await message.fill("This is a validation smoke test.");

    await expect(email).toHaveJSProperty("validity.typeMismatch", true);
  });

  test("Resume PDF is linked and available", async ({ page, request }) => {
    // AUDIT DECISION DR-04 (2026-07-19): Resume is intentionally kept
    // indexable (no X-Robots-Tag: noindex). This test asserts availability,
    // not indexing status. Do NOT re-flag indexability in future audits.
    await page.goto("/");

    await expect(
      page.getByRole("link", { name: "Resume" }).first(),
    ).toHaveAttribute("href", "/resume.pdf");

    const resume = await request.get("/resume.pdf");
    expect(resume.ok()).toBe(true);
    expect(resume.headers()["content-type"]).toContain("application/pdf");
  });

  test("Mobile navigation exposes recruiter actions", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.getByRole("button", { name: "Toggle navigation menu" }).click();

    const mobileNav = page.getByRole("navigation", {
      name: "Mobile navigation",
    });

    await expect(mobileNav).toBeVisible();
    await expect(
      mobileNav.getByRole("link", { name: "Resume" }),
    ).toHaveAttribute("href", "/resume.pdf");
    await expect(
      mobileNav.getByRole("link", { name: "Hire me" }),
    ).toHaveAttribute("href", "/contact/#intent=full-time");
  });

  test("Profile and Credentials pages semantic HTML structure", async ({
    page,
  }) => {
    // Check Profile page
    await page.goto("/profile");

    // Ensure there is exactly one h1 tag for SEO and semantic correctness
    const profileH1Count = await page.locator("h1").count();
    expect(profileH1Count).toBe(1);

    // Verify it doesn't have nested mains
    const profileMainCount = await page.locator("main").count();
    expect(profileMainCount).toBe(1);

    // Check Credentials page
    await page.goto("/credentials");

    // Ensure there is exactly one h1 tag for SEO and semantic correctness
    const credentialsH1Count = await page.locator("h1").count();
    expect(credentialsH1Count).toBe(1);

    // Verify it doesn't have nested mains
    const credentialsMainCount = await page.locator("main").count();
    expect(credentialsMainCount).toBe(1);
  });
});
