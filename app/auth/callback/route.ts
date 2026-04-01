import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/ssr";
import { ensureArtistTenantProvisioned } from "@/lib/tenants/provision";
import { getUserConsoleRoute } from "@/lib/supabase/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/agitprop";
  const safeNext = next.startsWith("/") ? next : "/agitprop";

  const cookieStore = await cookies();
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

  // Resolve the correct console for this user so OAuth never lands on the
  // wrong workspace (e.g. an admin hitting /studio gets bounced by proxy).
  if (data.user) {
    const consoleRoute = getUserConsoleRoute(data.user);
    if (consoleRoute) {
      return NextResponse.redirect(new URL(consoleRoute, url.origin));
    }
  }

  return NextResponse.redirect(new URL(safeNext, url.origin));
}
