/**
 * Unit tests: auth helpers
 *
 * Tests isPlatformAdmin, isArtistOperator, getUserConsoleRoute.
 * We mock a Supabase User object — no real auth needed.
 */

import { isPlatformAdmin, isArtistOperator, getUserConsoleRoute } from "@/lib/supabase/auth";
import type { User } from "@supabase/supabase-js";

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: "test-id",
    email: "artist@test.com",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: new Date().toISOString(),
    ...overrides,
  } as User;
}

describe("isPlatformAdmin", () => {
  test("returns true for allowlisted email", () => {
    const user = makeUser({ email: "pchandia@hotmail.com" });
    expect(isPlatformAdmin(user)).toBe(true);
  });

  test("returns true for user with admin role in app_metadata", () => {
    const user = makeUser({ app_metadata: { role: "admin" } });
    expect(isPlatformAdmin(user)).toBe(true);
  });

  test("returns false for regular user", () => {
    const user = makeUser({ email: "regular@artist.com" });
    expect(isPlatformAdmin(user)).toBe(false);
  });
});

describe("isArtistOperator", () => {
  test("returns false for platform admin", () => {
    const user = makeUser({ email: "pchandia@hotmail.com" });
    expect(isArtistOperator(user)).toBe(false);
  });

  test("returns true for regular authenticated user", () => {
    const user = makeUser({ email: "artist@studio.com" });
    expect(isArtistOperator(user)).toBe(true);
  });
});

describe("getUserConsoleRoute", () => {
  test("returns /admin for platform admin", () => {
    const user = makeUser({ email: "pchandia@hotmail.com" });
    expect(getUserConsoleRoute(user)).toBe("/admin");
  });

  test("returns /studio for artist", () => {
    const user = makeUser({ email: "artist@studio.com" });
    expect(getUserConsoleRoute(user)).toBe("/studio");
  });
});
