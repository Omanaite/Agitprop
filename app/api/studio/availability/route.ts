import { NextResponse } from "next/server";
import { z } from "zod";
import { requireArtistOperator } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { enforceSameOrigin } from "@/lib/security";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { DEFAULT_AVAILABILITY } from "@/lib/availability";
export type { ArtistAvailability } from "@/lib/availability";

const availabilitySchema = z.object({
  mon: z.boolean().default(false),
  tue: z.boolean().default(false),
  wed: z.boolean().default(false),
  thu: z.boolean().default(false),
  fri: z.boolean().default(false),
  sat: z.boolean().default(false),
  sun: z.boolean().default(false),
  start_time: z.string().regex(/^\d{2}:\d{2}$/).default("10:00"),
  end_time: z.string().regex(/^\d{2}:\d{2}$/).default("18:00"),
  notes: z.string().max(300).optional().default(""),
});

export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(`studio-avail:get:${ip}`, 60, 60_000).allowed)
    return NextResponse.json({ message: "Too many requests." }, { status: 429 });

  const auth = await requireArtistOperator();
  if (!auth.ok || !auth.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseServerClient();
  const { data } = await admin
    .from("artist_tenants")
    .select("availability")
    .eq("owner_user_id", auth.user.id)
    .maybeSingle();

  const merged = { ...DEFAULT_AVAILABILITY, ...(data?.availability ?? {}) };
  return NextResponse.json({ availability: merged });
}

export async function PUT(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok)
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });

  const ip = getClientIp(request);
  if (!rateLimit(`studio-avail:put:${ip}`, 20, 60_000).allowed)
    return NextResponse.json({ message: "Too many requests." }, { status: 429 });

  const auth = await requireArtistOperator();
  if (!auth.ok || !auth.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const json = await request.json().catch(() => null);
  const parsed = availabilitySchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });

  const admin = createSupabaseServerClient();
  const { error } = await admin
    .from("artist_tenants")
    .update({ availability: parsed.data })
    .eq("owner_user_id", auth.user.id);

  if (error) {
    if (error.message?.includes("availability") || error.code === "42703")
      return NextResponse.json({ message: "Run MVP_COMPLETION_PATCH.sql first." }, { status: 409 });
    return NextResponse.json({ message: "Failed to save availability." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, availability: parsed.data });
}
