import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/ssr";
import { ensureArtistTenantProvisioned } from "@/lib/tenants/provision";
import { getUserConsoleRoute } from "@/lib/supabase/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  // The `next` query-param may be stripped by Supabase during the OAuth
  // round-trip, so we also check the `oauth_next` cookie set by
  // /api/auth/oauth before initiating the flow.
  const cookieStore = await cookies();
  const cookieNext = cookieStore.get("oauth_next")?.value;
  const queryNext = url.searchParams.get("next");
  const next = cookieNext || queryNext || "/agitprop";
  const safeNext = next.startsWith("/") ? next : "/agitprop";
  const isOAuth = next.includes("register/complete");

  // Clear the one-time cookie.
  if (cookieNext) {
    cookieStore.delete("oauth_next");
  }

  const supabase = createSupabaseServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach((cookie) => cookieStore.set(cookie));
    },
  });

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  const { data } = await supabase.auth.getUser();
  if (data.user?.id && data.user.email) {
    try {
      await ensureArtistTenantProvisioned({
        userId: data.user.id,
        email: data.user.email,
        appMetadata: data.user.app_metadata,
      });
    } catch {
      // Do not block OAuth callback redirect on tenant bootstrap issues.
    }
  }

  // OAuth flows: always go to /register/complete?source=oauth so new users
  // see the onboarding page. Existing users can return to home/workspace from there.
  if (isOAuth) {
    return NextResponse.redirect(new URL("/register/complete?source=oauth", url.origin));
  }

  // Explicit next param (e.g., /studio): resolve the correct console for this user
  // so OAuth never lands on the wrong workspace.
  if (data.user && next !== "/agitprop") {
    const consoleRoute = getUserConsoleRoute(data.user);
    if (consoleRoute) {
      return NextResponse.redirect(new URL(consoleRoute, url.origin));
    }
  }

  return NextResponse.redirect(new URL(safeNext, url.origin));
}
