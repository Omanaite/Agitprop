import { NextResponse } from "next/server";
import { requireArtistOperator } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";
import { logAuditEvent } from "@/lib/audit";

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`studio-bookings:list:${ip}`, 60, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  const auth = await requireArtistOperator();
  if (!auth.ok) {
    return NextResponse.json(
      { message: auth.reason === "forbidden" ? "Forbidden" : "Unauthorized" },
      { status: auth.reason === "forbidden" ? 403 : 401 }
    );
  }
  if (!auth.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const adminClient = createSupabaseServerClient();

  const { data, error } = await adminClient
    .from("bookings")
    .select("id,name,email,preferred_date,placement,description,status,created_at")
    .eq("owner_user_id", auth.user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    // owner_user_id column may not exist yet — return empty gracefully.
    const code = String(error.code ?? "");
    const msg = String(error.message ?? "").toLowerCase();
    if (code === "42703" || msg.includes("owner_user_id") || msg.includes("column")) {
      return NextResponse.json({ items: [], schemaPending: true });
    }
    return NextResponse.json(
      { message: "Failed to load bookings.", detail: process.env.NODE_ENV === "production" ? undefined : error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ items: data ?? [] });
}

export async function PATCH(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }
  const ip = getClientIp(request);
  const limit = rateLimit(`studio-bookings:update:${ip}`, 30, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  const auth = await requireArtistOperator();
  if (!auth.ok) {
    return NextResponse.json(
      { message: auth.reason === "forbidden" ? "Forbidden" : "Unauthorized" },
      { status: auth.reason === "forbidden" ? 403 : 401 }
    );
  }
  if (!auth.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await request.json();
    const { id, status, preferred_date } = json;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ message: "Invalid id." }, { status: 400 });
    }

    const adminClient = createSupabaseServerClient();

    // Reschedule: update preferred_date only
    if (typeof preferred_date === "string") {
      const dateRe = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRe.test(preferred_date)) {
        return NextResponse.json({ message: "Invalid date format (YYYY-MM-DD)." }, { status: 400 });
      }
      const { error } = await adminClient
        .from("bookings")
        .update({ preferred_date })
        .eq("id", id)
        .eq("owner_user_id", auth.user.id);
      if (error) {
        return NextResponse.json({ message: "Failed to reschedule booking." }, { status: 500 });
      }
      await logAuditEvent({
        actor_email: auth.user.email ?? null,
        action: "update",
        entity: "bookings",
        entity_id: id,
        metadata: { preferred_date },
      });
      return NextResponse.json({ ok: true, preferred_date });
    }

    const allowed = ["pending", "confirmed", "declined", "completed"];
    if (!status || !allowed.includes(status)) {
      return NextResponse.json(
        { message: `Status must be one of: ${allowed.join(", ")}.` },
        { status: 400 }
      );
    }

    const { error } = await adminClient
      .from("bookings")
      .update({ status })
      .eq("id", id)
      .eq("owner_user_id", auth.user.id);

    if (error) {
      return NextResponse.json(
        { message: "Failed to update booking.", detail: process.env.NODE_ENV === "production" ? undefined : error.message },
        { status: 500 }
      );
    }

    await logAuditEvent({
      actor_email: auth.user.email ?? null,
      action: "update",
      entity: "bookings",
      entity_id: id,
      metadata: { status },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }
}
