import { NextResponse } from "next/server";
import { z } from "zod";
import { requireArtistOperator } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { enforceSameOrigin } from "@/lib/security";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const rateCardSchema = z.object({
  id: z.string(),
  label: z.string().min(1).max(120),
  price: z.string().max(60),
  description: z.string().max(500).optional().default(""),
  capacity: z.number().int().min(1).max(9999).optional().nullable(),
});

const putSchema = z.object({ cards: z.array(rateCardSchema).max(20) });

export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(`studio-rates:get:${ip}`, 60, 60_000).allowed)
    return NextResponse.json({ message: "Too many requests." }, { status: 429 });

  const auth = await requireArtistOperator();
  if (!auth.ok || !auth.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseServerClient();
  const { data } = await admin
    .from("artist_tenants")
    .select("rates")
    .eq("owner_user_id", auth.user.id)
    .maybeSingle();

  return NextResponse.json({ cards: data?.rates ?? [] });
}

export async function PUT(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok)
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });

  const ip = getClientIp(request);
  if (!rateLimit(`studio-rates:put:${ip}`, 20, 60_000).allowed)
    return NextResponse.json({ message: "Too many requests." }, { status: 429 });

  const auth = await requireArtistOperator();
  if (!auth.ok || !auth.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const json = await request.json().catch(() => null);
  const parsed = putSchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });

  const admin = createSupabaseServerClient();
  const { error } = await admin
    .from("artist_tenants")
    .update({ rates: parsed.data.cards })
    .eq("owner_user_id", auth.user.id);

  if (error) {
    if (error.message?.includes("rates") || error.code === "42703")
      return NextResponse.json({ message: "Run MVP_COMPLETION_PATCH.sql first." }, { status: 409 });
    return NextResponse.json({ message: "Failed to save rates." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, cards: parsed.data.cards });
}
