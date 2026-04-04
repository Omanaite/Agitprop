import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { DEFAULT_AVAILABILITY } from "@/app/api/studio/availability/route";

export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(`public-avail:${ip}`, 60, 60_000).allowed)
    return NextResponse.json({ message: "Too many requests." }, { status: 429 });

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();
  if (!slug) return NextResponse.json({ availability: DEFAULT_AVAILABILITY });

  const admin = createSupabaseServerClient();
  const { data } = await admin
    .from("artist_tenants")
    .select("availability")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  const merged = { ...DEFAULT_AVAILABILITY, ...(data?.availability ?? {}) };
  return NextResponse.json({ availability: merged });
}
