"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/ssr";

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

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirect("/admin/login?error=invalid");
  }

  if (data.user.app_metadata?.role !== "admin") {
    await supabase.auth.signOut();
    redirect("/admin/login?error=forbidden");
  }

  redirect("/admin");
}
