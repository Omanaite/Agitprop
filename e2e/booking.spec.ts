import { test, expect } from "@playwright/test";

/**
 * E2E: Booking form flow
 *
 * Tests the full booking form submission from the user's perspective.
 * Playwright fills in the form and submits it — same as a real user.
 */

test("booking form submission shows success state", async ({ page }) => {
  await page.goto("/akemion-tattoo");

  // Wait for page to settle
  await page.waitForLoadState("networkidle");

  // Find and fill the booking form
  const nameInput = page.locator('input[name="name"]').first();
  const emailInput = page.locator('input[name="email"], input[type="email"]').first();

  if (!(await nameInput.isVisible())) {
    // Scroll to booking section
    await page.evaluate(() => {
      const el = document.getElementById("booking");
      if (el) el.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(500);
  }

  await nameInput.fill("Test User");
  await emailInput.fill("smoke@test.com");

  // Fill date if present
  const dateInput = page.locator('input[type="date"], input[name*="date" i]').first();
  if (await dateInput.isVisible()) {
    await dateInput.fill("2026-06-01");
  }

  // Fill placement
  const placementInput = page.locator('input[name*="placement" i], textarea[name*="placement" i]').first();
  if (await placementInput.isVisible()) {
    await placementInput.fill("forearm");
  }

  // Fill description
  const descInput = page.locator('textarea[name*="description" i], textarea').first();
  if (await descInput.isVisible()) {
    await descInput.fill("E2E smoke test booking");
  }

  // Submit
  const submitBtn = page.locator('button[type="submit"]').first();
  await submitBtn.click();

  // Should show success message (not error)
  await expect(
    page.locator("text=/success|sent|received|thank/i").first()
  ).toBeVisible({ timeout: 8000 });
});
