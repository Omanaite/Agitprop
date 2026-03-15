import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/ssr";
import { cookies } from "next/headers";

const allowedProviders = new Set([
  "google",
  "github",
  "facebook",
  "dropbox",
  "drive",
  "s3",
]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider") || "";

  if (!allowedProviders.has(provider)) {
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
    provider,
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
