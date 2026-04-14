import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const DAY_KEYS = ["sun","mon","tue","wed","thu","fri","sat"] as const;

export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(`public-avail-slots:${ip}`, 60, 60_000).allowed)
    return NextResponse.json({ message: "Too many requests." }, { status: 429 });

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();
  const date = searchParams.get("date")?.trim(); // YYYY-MM-DD

  if (!slug) return NextResponse.json({ slots: [] });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  // Get tenant + slots
  const { data: tenant } = await supabase
    .from("artist_tenants")
    .select("owner_user_id, availability_slots")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (!tenant) return NextResponse.json({ slots: [] });

  const allSlots: {
    id: string; label: string; days: string[];
    from: string; until: string; capacity: number; note?: string;
  }[] = tenant.availability_slots ?? [];

  if (!date) return NextResponse.json({ slots: allSlots.map((s) => ({ ...s, booked: 0, available: s.capacity })) });

  // Filter slots matching the day of week
  const dayOfWeek = DAY_KEYS[new Date(date + "T12:00:00").getDay()];
  const daySlots = allSlots.filter((s) => s.days.includes(dayOfWeek));

  if (daySlots.length === 0) return NextResponse.json({ slots: [] });

  // Count existing bookings per slot for this date
  const { data: bookings } = await supabase
    .from("bookings")
    .select("slot_id")
    .eq("owner_user_id", tenant.owner_user_id)
    .eq("preferred_date", date)
    .in("status", ["pending", "confirmed"]);

  const counts: Record<string, number> = {};
  for (const b of bookings ?? []) {
    if (b.slot_id) counts[b.slot_id] = (counts[b.slot_id] ?? 0) + 1;
  }

  const result = daySlots.map((s) => ({
    ...s,
    booked: counts[s.id] ?? 0,
    available: Math.max(0, s.capacity - (counts[s.id] ?? 0)),
  }));

  return NextResponse.json({ slots: result });
}
