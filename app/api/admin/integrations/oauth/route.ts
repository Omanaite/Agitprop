import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/ssr";
import type { Provider } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const allowedProviders: Provider[] = ["google", "github", "facebook"];
const allowedSet = new Set(allowedProviders);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider") || "";

  if (!allowedSet.has(provider)) {
    return NextResponse.json({ message: "Invalid provider." }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach((cookie) => cookieStore.set(cookie));
    },
  });

  const redirectTo = `${url.origin}/api/admin/integrations/callback?provider=${provider}`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as Provider,
    options: {
      redirectTo,
    },
  });

  if (error || !data?.url) {
    return NextResponse.json(
      { message: "Failed to start OAuth." },
      { status: 500 }
    );
  }

  return NextResponse.redirect(data.url);
}
