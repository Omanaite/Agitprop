import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E config.
 *
 * Two modes:
 *   - Local dev: runs against http://localhost:3000 (start with `npm run dev`)
 *   - CI / production: runs against PLAYWRIGHT_BASE_URL env var
 *
 * Run:  npx playwright test
 * UI:   npx playwright test --ui
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
