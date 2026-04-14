import { NextResponse } from "next/server";
import { z } from "zod";
import { requireArtistOperator } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { enforceSameOrigin } from "@/lib/security";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { logAuditEvent } from "@/lib/audit";

const DAYS = ["mon","tue","wed","thu","fri","sat","sun"] as const;

const slotSchema = z.object({
  id: z.string().min(1).max(40),
  label: z.string().min(1).max(80),
  days: z.array(z.enum(DAYS)).min(1),
  from: z.string().regex(/^\d{2}:\d{2}$/),
  until: z.string().regex(/^\d{2}:\d{2}$/),
  capacity: z.number().int().min(1).max(500),
  note: z.string().max(200).optional().default(""),
});

const bodySchema = z.object({
  slots: z.array(slotSchema).max(20),
});

export type AvailabilitySlot = z.infer<typeof slotSchema>;

async function guard(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) return { error: NextResponse.json({ message: "Invalid origin." }, { status: 403 }) };
  const ip = getClientIp(request);
  if (!rateLimit(`studio-avail-slots:${ip}`, 30, 60_000).allowed)
    return { error: NextResponse.json({ message: "Too many requests." }, { status: 429 }) };
  const auth = await requireArtistOperator();
  if (!auth.ok || !auth.user) return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  return { user: auth.user };
}

export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(`studio-avail-slots:get:${ip}`, 60, 60_000).allowed)
    return NextResponse.json({ message: "Too many requests." }, { status: 429 });
  const auth = await requireArtistOperator();
  if (!auth.ok || !auth.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseServerClient();
  const { data } = await admin
    .from("artist_tenants")
    .select("availability_slots")
    .eq("owner_user_id", auth.user.id)
    .maybeSingle();

  return NextResponse.json({ slots: data?.availability_slots ?? [] });
}

export async function PUT(request: Request) {
  const r = await guard(request);
  if ("error" in r) return r.error;

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ message: "Invalid payload.", errors: parsed.error.issues }, { status: 400 });

  const admin = createSupabaseServerClient();
  const { error } = await admin
    .from("artist_tenants")
    .update({ availability_slots: parsed.data.slots })
    .eq("owner_user_id", r.user.id);

  if (error) return NextResponse.json({ message: "Failed to save." }, { status: 500 });

  await logAuditEvent({ actor_email: r.user.email ?? null, action: "update", entity: "artist_tenants", entity_id: r.user.id, metadata: { availability_slots: true } });
  return NextResponse.json({ ok: true, slots: parsed.data.slots });
}
