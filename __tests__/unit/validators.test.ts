/**
 * Unit tests: Zod validators
 *
 * Jest tests run in Node.js (no browser). They call functions directly
 * and check the output with expect(). Fast — no network, no UI.
 *
 * Structure:
 *   describe() = group of related tests
 *   test() / it() = one scenario
 *   expect(value).toBe(expected) = assertion
 *
 * Run: npx jest
 */

import { bookingSchema, homepageSectionSchema } from "@/lib/validators";

describe("bookingSchema", () => {
  const valid = {
    name: "Akemi Test",
    email: "test@akemi.tattoo",
    preferredDate: "2026-06-01",
    placement: "forearm",
    description: "A dragon sleeve",
  };

  test("accepts valid booking payload", () => {
    const result = bookingSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  test("rejects missing name", () => {
    const result = bookingSchema.safeParse({ ...valid, name: "" });
    expect(result.success).toBe(false);
  });

  test("rejects invalid email", () => {
    const result = bookingSchema.safeParse({ ...valid, email: "notanemail" });
    expect(result.success).toBe(false);
  });

  test("rejects missing description", () => {
    const result = bookingSchema.safeParse({ ...valid, description: "" });
    expect(result.success).toBe(false);
  });
});

describe("homepageSectionSchema", () => {
  test("accepts section with body", () => {
    const result = homepageSectionSchema.safeParse({
      section_key: "hero",
      title: "Hello",
      sort_order: 0,
      is_visible: true,
      body: "Some artist copy here.",
    });
    expect(result.success).toBe(true);
  });

  test("accepts section without body", () => {
    const result = homepageSectionSchema.safeParse({
      section_key: "about",
      title: "About",
      sort_order: 1,
      is_visible: false,
    });
    expect(result.success).toBe(true);
  });
});
