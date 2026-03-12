import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/ssr";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach((cookie) => cookieStore.set(cookie));
    },
  });

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { ok: false, supabase, reason: "unauthenticated" as const };
  }

  const isAdmin = data.user.app_metadata?.role === "admin";
  if (!isAdmin) {
    return { ok: false, supabase, reason: "forbidden" as const };
  }

  return { ok: true, supabase, user: data.user };
}
