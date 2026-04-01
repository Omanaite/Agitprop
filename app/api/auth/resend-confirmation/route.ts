import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/ssr";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";
import { getSiteUrl } from "@/lib/site-url";

export async function POST(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }

  const ip = getClientIp(request);
  const limit = rateLimit(`resend-confirmation:${ip}`, 3, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many attempts. Wait a minute before trying again." },
      { status: 429 }
    );
  }

  let email: string;
  try {
    const json = await request.json();
    email = String(json?.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach((cookie) => cookieStore.set(cookie));
    },
  });

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${getSiteUrl()}/register/complete?source=email`,
    },
  });

  if (error) {
    // Always return success to avoid email enumeration.
    // Only surface rate limit errors explicitly.
    const msg = error.message.toLowerCase();
    if (msg.includes("rate") || msg.includes("too many")) {
      return NextResponse.json(
        { message: "Too many confirmation emails sent. Wait a few minutes." },
        { status: 429 }
      );
    }
  }

  return NextResponse.json({
    ok: true,
    message: "If that email has a pending confirmation, a new link has been sent.",
  });
}
