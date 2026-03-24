import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { Provider } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/ssr";

const allowedProviders: Provider[] = ["google", "github"];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider") || "";
  const next = url.searchParams.get("next") || "/register/complete?source=oauth";
  const isAllowedProvider = (value: string): value is Provider =>
    allowedProviders.includes(value as Provider);

  if (!isAllowedProvider(provider)) {
    return NextResponse.json({ message: "Invalid provider." }, { status: 400 });
  }

  const safeNext = next.startsWith("/") ? next : "/register/complete?source=oauth";
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach((cookie) => cookieStore.set(cookie));
    },
  });

  const redirectTo = `${url.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });

  if (error || !data?.url) {
    return NextResponse.redirect(
      new URL("/register?error=oauth_start_failed", url.origin)
    );
  }

  return NextResponse.redirect(data.url);
}
