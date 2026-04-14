import { NextResponse } from "next/server";
import { z } from "zod";
import { requireArtistOperator } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { enforceSameOrigin } from "@/lib/security";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { logAuditEvent } from "@/lib/audit";

// Slot = a specific time window on a specific calendar date
const slotSchema = z.object({
  id: z.string().min(1).max(40),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  from: z.string().regex(/^\d{2}:\d{2}$/),
  until: z.string().regex(/^\d{2}:\d{2}$/),
  capacity: z.number().int().min(1).max(500),
  label: z.string().max(80).optional().default(""),
  note: z.string().max(200).optional().default(""),
});

const bodySchema = z.object({
  slots: z.array(slotSchema).max(200),
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

  // Return only future slots (today included), sorted by date+from
  const today = new Date().toISOString().split("T")[0];
  const slots: AvailabilitySlot[] = (data?.availability_slots ?? [])
    .filter((s: AvailabilitySlot) => s.date >= today)
    .sort((a: AvailabilitySlot, b: AvailabilitySlot) =>
      a.date === b.date ? a.from.localeCompare(b.from) : a.date.localeCompare(b.date)
    );

  return NextResponse.json({ slots });
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

  await logAuditEvent({
    actor_email: r.user.email ?? null,
    action: "update",
    entity: "artist_tenants",
    entity_id: r.user.id,
    metadata: { availability_slots: true },
  });
  return NextResponse.json({ ok: true, slots: parsed.data.slots });
}
