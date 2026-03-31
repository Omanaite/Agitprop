import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/ssr";
import { ensureArtistTenantProvisioned } from "@/lib/tenants/provision";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";
  const safeNext = next.startsWith("/") ? next : "/";

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

  return NextResponse.redirect(new URL(safeNext, url.origin));
}
