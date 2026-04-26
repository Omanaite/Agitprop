import { NextResponse } from "next/server";

export const runtime = "nodejs";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

type Slot = {
  id: string; date: string; from: string; until: string;
  capacity: number; label?: string; note?: string;
};

// Anon client for reading public tenant data (artist_tenants has public RLS)
function getAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

// GET ?slug=X&date=YYYY-MM-DD  → slots for that exact date with capacity info
// GET ?slug=X                  → all upcoming dates that have slots (for calendar highlight)
export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(`public-avail-slots:${ip}`, 120, 60_000).allowed)
    return NextResponse.json({ message: "Too many requests." }, { status: 429 });

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();
  const date = searchParams.get("date")?.trim();

  if (!slug) return NextResponse.json({ slots: [], dates: [] });

  const anon = getAnonClient();
  const admin = createSupabaseServerClient(); // service role — needed to count bookings (RLS blocks anon)

  const { data: tenant } = await anon
    .from("artist_tenants")
    .select("owner_user_id, availability_slots")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (!tenant) return NextResponse.json({ slots: [], dates: [] });

  const today = new Date().toISOString().split("T")[0];
  const allSlots: Slot[] = (tenant.availability_slots ?? [])
    .filter((s: Slot) => s.date >= today);

  // No date param → return list of unique upcoming dates that have slots
  if (!date) {
    const dates = [...new Set(allSlots.map((s) => s.date))].sort();
    return NextResponse.json({ dates, slots: [] });
  }

  // With date → return slots for that exact date with booked/available counts
  const daySlots = allSlots.filter((s) => s.date === date);
  if (daySlots.length === 0) return NextResponse.json({ slots: [], dates: [] });

  const { data: bookings } = await admin
    .from("bookings")
    .select("slot_id")
    .eq("owner_user_id", tenant.owner_user_id)
    .eq("preferred_date", date)
    .in("status", ["pending", "confirmed"]);

  const counts: Record<string, number> = {};
  for (const b of bookings ?? []) {
    if (b.slot_id) counts[b.slot_id] = (counts[b.slot_id] ?? 0) + 1;
  }

  const slots = daySlots
    .sort((a, b) => a.from.localeCompare(b.from))
    .map((s) => ({
      ...s,
      booked: counts[s.id] ?? 0,
      available: Math.max(0, s.capacity - (counts[s.id] ?? 0)),
    }));

  return NextResponse.json({ slots, dates: [] });
}
