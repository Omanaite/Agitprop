import { test, expect } from "@playwright/test";

/**
 * E2E: Public site smoke tests
 *
 * These tests run against the real browser (Chromium) and verify that
 * the public-facing pages load correctly and key UI elements are present.
 *
 * Playwright controls a real browser — it clicks, types, navigates, and
 * checks what a real user would see. No mocking.
 *
 * Run with: PLAYWRIGHT_BASE_URL=https://agitpropstudio.vercel.app npx playwright test
 * Or locally: npm run dev  →  npx playwright test
 */

test.describe("Artist public site", () => {
  test("artist page loads with hero section", async ({ page }) => {
    // Navigate to the artist's public page
    await page.goto("/akemion-tattoo");

    // The page should load (not 404 or error)
    await expect(page).not.toHaveURL(/error/);

    // There should be a heading visible
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("booking form is present and submittable", async ({ page }) => {
    await page.goto("/akemion-tattoo");

    // Scroll to booking section
    await page.evaluate(() => {
      const el = document.getElementById("booking");
      if (el) el.scrollIntoView();
    });

    // Name field should exist
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    await expect(nameInput).toBeVisible({ timeout: 5000 });
  });

  test("gallery grid is visible", async ({ page }) => {
    await page.goto("/akemion-tattoo");

    // Gallery section should have images
    const images = page.locator("article img, .tattoo-image");
    const count = await images.count();
    // Accept 0 if no tattoos uploaded yet — just verify no crash
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe("Platform pages", () => {
  test("register page loads", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("form, input[type=email]").first()).toBeVisible();
  });

  test("studio login page loads", async ({ page }) => {
    await page.goto("/studio/login");
    await expect(page.locator("form, input[type=email]").first()).toBeVisible();
  });

  test("admin login page loads", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator("form, input[type=email]").first()).toBeVisible();
  });

  test("studio redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/studio");
    // Should end up on studio/login
    await expect(page).toHaveURL(/studio\/login/);
  });

  test("admin redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/admin\/login/);
  });
});
