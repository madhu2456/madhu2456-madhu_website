import { test, expect } from '@playwright/test';

test.describe('Portfolio Audit UI Checks', () => {
  test('Home page should not have nested <main> tags', async ({ page }) => {
    await page.goto('/');
    
    // Check that there is exactly one <main> element on the page
    const mainElements = await page.locator('main').count();
    expect(mainElements).toBe(1);
    
    // Check that the single main element is the primary wrapper
    // The previous implementation had <main id="main-content"> in page.tsx 
    // inside the layout's <main>, causing nested main tags.
    // Ensure the home page renders correctly without error.
    await expect(page.locator('text=Madhu Dadi').first()).toBeVisible();
  });

  test('Contact page FAQ rendering correctly from schema', async ({ page }) => {
    await page.goto('/contact');
    
    // The FAQ questions were extracted to a map in the fix
    // We should expect the definitions list <dl> and terms <dt> to be present
    const faqTerms = page.locator('dt');
    
    // There are 4 FAQs in the schema, we expect to see at least 4 items
    const count = await faqTerms.count();
    expect(count).toBeGreaterThanOrEqual(4);
    
    // Check if the FAQ answers are rendered
    const faqAnswers = page.locator('dd');
    const answerCount = await faqAnswers.count();
    expect(answerCount).toBeGreaterThanOrEqual(4);
    
    // Check visibility of a known FAQ question
    await expect(page.locator('text=What is your typical turnaround time?')).toBeVisible();
  });

  test('Profile and Credentials pages semantic HTML structure', async ({ page }) => {
    // Check Profile page
    await page.goto('/profile');
    
    // Ensure there is exactly one h1 tag for SEO and semantic correctness
    const profileH1Count = await page.locator('h1').count();
    expect(profileH1Count).toBe(1);
    
    // Verify it doesn't have nested mains
    const profileMainCount = await page.locator('main').count();
    expect(profileMainCount).toBe(1);

    // Check Credentials page
    await page.goto('/credentials');
    
    // Ensure there is exactly one h1 tag for SEO and semantic correctness
    const credentialsH1Count = await page.locator('h1').count();
    expect(credentialsH1Count).toBe(1);
    
    // Verify it doesn't have nested mains
    const credentialsMainCount = await page.locator('main').count();
    expect(credentialsMainCount).toBe(1);
  });
});
