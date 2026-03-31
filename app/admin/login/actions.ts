"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/ssr";
import { getUserConsoleRoute } from "@/lib/supabase/auth";

export async function signInAdmin(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  if (!email || !password) {
    redirect("/admin/login?error=missing");
  }

  let supabase;
  try {
    const cookieStore = await cookies();
    supabase = createSupabaseServerClient({
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach((cookie) => cookieStore.set(cookie));
      },
    });
  } catch {
    redirect("/admin/login?error=config");
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      const message = error?.message?.toLowerCase() ?? "";
      if (message.includes("confirm") || message.includes("confirmed")) {
        redirect("/admin/login?error=unconfirmed");
      }
      if (message.includes("rate") || message.includes("too many")) {
        redirect("/admin/login?error=rate");
      }
      redirect("/admin/login?error=invalid");
    }

    const consoleRoute = getUserConsoleRoute(data.user);
    if (!consoleRoute) {
      await supabase.auth.signOut();
      redirect("/admin/login?error=forbidden");
    }

    redirect(consoleRoute);
  } catch (err) {
    const digest = (err as { digest?: string } | null)?.digest ?? "";
    if (digest.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    const message = err instanceof Error ? err.message : "unknown";
    const reason = encodeURIComponent(message.slice(0, 80));
    redirect(`/admin/login?error=server&reason=${reason}`);
  }
}
