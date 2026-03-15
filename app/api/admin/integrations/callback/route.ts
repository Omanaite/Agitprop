import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/ssr";
import { requireAdmin } from "@/lib/supabase/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider") || "";
  const code = url.searchParams.get("code");

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

  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.redirect(new URL("/admin/login", url.origin));
  }

  if (provider) {
    await auth.supabase
      .from("admin_integrations")
      .upsert({
        user_id: auth.user.id,
        provider,
        status: "connected",
        connected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", auth.user.id)
      .eq("provider", provider);
  }

  return NextResponse.redirect(new URL("/admin?oauth=connected", url.origin));
}
