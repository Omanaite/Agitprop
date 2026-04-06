/**
 * Unit tests: rate limiter
 *
 * Pure function — no network, no DB. We just call rateLimit() directly
 * and verify it allows/blocks requests correctly.
 */

import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  test("allows requests under the limit", () => {
    const key = `test-allow-${Date.now()}`;
    const result = rateLimit(key, 5, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  test("blocks requests over the limit", () => {
    const key = `test-block-${Date.now()}`;
    // Exhaust the limit
    for (let i = 0; i < 3; i++) {
      rateLimit(key, 3, 60_000);
    }
    // 4th request should be blocked
    const result = rateLimit(key, 3, 60_000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  test("different keys don't interfere", () => {
    const key1 = `test-key1-${Date.now()}`;
    const key2 = `test-key2-${Date.now()}`;

    // Exhaust key1
    for (let i = 0; i < 3; i++) rateLimit(key1, 3, 60_000);
    const blocked = rateLimit(key1, 3, 60_000);
    expect(blocked.allowed).toBe(false);

    // key2 should still be fine
    const allowed = rateLimit(key2, 3, 60_000);
    expect(allowed.allowed).toBe(true);
  });
});
