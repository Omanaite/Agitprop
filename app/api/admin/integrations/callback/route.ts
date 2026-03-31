import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/ssr";
import { requireAdmin } from "@/lib/supabase/auth";

function isMissingIntegrationsTable(error: {
  code?: string;
  message?: string;
} | null) {
  const code = String(error?.code ?? "");
  const message = String(error?.message ?? "").toLowerCase();
  return (
    code === "42P01" ||
    code === "PGRST205" ||
    message.includes("admin_integrations") ||
    (message.includes("relation") && message.includes("does not exist"))
  );
}

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
  if (!auth.user) {
    return NextResponse.redirect(new URL("/admin/login", url.origin));
  }

  if (provider) {
    const { error } = await auth.supabase
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
    if (error && !isMissingIntegrationsTable(error)) {
      return NextResponse.redirect(
        new URL("/admin/login?error=server", url.origin)
      );
    }
  }

  return NextResponse.redirect(new URL("/admin?oauth=connected", url.origin));
}
