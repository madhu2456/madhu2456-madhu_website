import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only; add 1 retry locally to handle Turbopack flakiness */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://127.0.0.1:3000",

    /* Wait for network to be idle before considering page loaded; helps with chunk load flakiness */
    // Note: each test can override with its own waitUntil
    // Default navigation timeout if not specified per-goto
    navigationTimeout: 15000,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers and devices */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "iphone",
      use: { ...devices["iPhone 14"], browserName: "chromium" },
    },
    {
      name: "pixel",
      use: { ...devices["Pixel 7"], browserName: "chromium" },
    },
    {
      name: "ipad",
      use: { ...devices["iPad (gen 7)"], browserName: "chromium" },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "pnpm build && pnpm start",
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: false,
  },
});
