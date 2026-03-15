import { NextResponse } from "next/server";
import { adminProfileSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/supabase/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";
import { logAuditEvent } from "@/lib/audit";

export async function GET(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }
  const ip = getClientIp(request);
  const limit = rateLimit(`admin-profile:get:${ip}`, 60, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { message: auth.reason === "forbidden" ? "Forbidden" : "Unauthorized" },
      { status: auth.reason === "forbidden" ? 403 : 401 }
    );
  }

  const { data, error } = await auth.supabase
    .from("admin_profiles")
    .select("id,email,nickname,shipping_address,billing_address,payment_notes")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      {
        message: "Failed to load profile.",
        detail: process.env.NODE_ENV === "production" ? undefined : error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    profile: data ?? {
      email: auth.user.email ?? "",
      nickname: "",
      shipping_address: "",
      billing_address: "",
      payment_notes: "",
    },
  });
}

export async function PUT(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }
  const ip = getClientIp(request);
  const limit = rateLimit(`admin-profile:update:${ip}`, 30, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { message: auth.reason === "forbidden" ? "Forbidden" : "Unauthorized" },
      { status: auth.reason === "forbidden" ? 403 : 401 }
    );
  }

  try {
    const json = await request.json();
    const parsed = adminProfileSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid payload.",
          errors: parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const payload = parsed.data;
    const { error } = await auth.supabase
      .from("admin_profiles")
      .upsert({
        user_id: auth.user.id,
        email: payload.email,
        nickname: payload.nickname ?? null,
        shipping_address: payload.shipping_address ?? null,
        billing_address: payload.billing_address ?? null,
        payment_notes: payload.payment_notes ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", auth.user.id);

    if (error) {
      return NextResponse.json(
        {
          message: "Failed to update profile.",
          detail:
            process.env.NODE_ENV === "production" ? undefined : error.message,
        },
        { status: 500 }
      );
    }

    await logAuditEvent({
      actor_email: auth.user.email ?? null,
      action: "update",
      entity: "admin_profiles",
      entity_id: auth.user.id,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }
}
