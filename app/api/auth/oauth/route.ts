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

  // Persist the intended destination in a cookie so it survives the OAuth
  // round-trip — Supabase may strip query params from the redirectTo URL.
  cookieStore.set("oauth_next", safeNext, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 min — more than enough for the OAuth flow
  });

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
