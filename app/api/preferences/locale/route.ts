import { NextResponse } from "next/server";
import { localeCookieName, resolveLocale } from "@/lib/i18n";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { locale?: string }
    | null;
  const locale = resolveLocale(body?.locale);
  const response = NextResponse.json({ ok: true, locale });

  response.cookies.set(localeCookieName, locale, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
