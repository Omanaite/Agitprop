import { NextResponse } from "next/server";
import { adminPaymentSettingsSchema } from "@/lib/validators";
import { requireArtistOperator } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";
import { logAuditEvent } from "@/lib/audit";

function isMissingPaymentSettingsTable(error: {
  code?: string;
  message?: string;
} | null) {
  const code = String(error?.code ?? "");
  const message = String(error?.message ?? "").toLowerCase();
  return (
    code === "42P01" ||
    code === "PGRST205" ||
    message.includes("relation \"admin_payment_settings\"") ||
    (message.includes("relation") && message.includes("does not exist"))
  );
}

const emptySettings = {
  mode: "test",
  stripe_account_id: "",
  stripe_public_reference: "",
  paypal_merchant_email: "",
  paypal_merchant_id: "",
  notes: "",
};

export async function GET(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }
  const ip = getClientIp(request);
  const limit = rateLimit(`studio-payment-settings:get:${ip}`, 60, 60_000);
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
    .from("admin_payment_settings")
    .select(
      "mode,stripe_account_id,stripe_public_reference,paypal_merchant_email,paypal_merchant_id,notes"
    )
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (error) {
    if (isMissingPaymentSettingsTable(error)) {
      return NextResponse.json({
        settings: emptySettings,
        fallback: true,
        warning: "admin_payment_settings table missing in target environment.",
      });
    }
    return NextResponse.json(
      {
        message: "Failed to load payment settings.",
        detail: process.env.NODE_ENV === "production" ? undefined : error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ settings: data ?? emptySettings });
}

export async function PUT(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }
  const ip = getClientIp(request);
  const limit = rateLimit(`studio-payment-settings:update:${ip}`, 30, 60_000);
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
    const parsed = adminPaymentSettingsSchema.safeParse(json);
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
    const adminClient = createSupabaseServerClient();
    const { error } = await adminClient
      .from("admin_payment_settings")
      .upsert(
        {
          user_id: auth.user.id,
          mode: payload.mode,
          stripe_account_id: payload.stripe_account_id ?? null,
          stripe_public_reference: payload.stripe_public_reference ?? null,
          paypal_merchant_email: payload.paypal_merchant_email ?? null,
          paypal_merchant_id: payload.paypal_merchant_id ?? null,
          notes: payload.notes ?? null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      );

    if (error) {
      if (isMissingPaymentSettingsTable(error)) {
        return NextResponse.json(
          {
            message:
              "Payment settings storage is not ready. Run the latest Supabase schema first.",
            code: "schema_missing",
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        {
          message: "Failed to update payment settings.",
          detail:
            process.env.NODE_ENV === "production" ? undefined : error.message,
        },
        { status: 500 }
      );
    }

    await logAuditEvent({
      actor_email: auth.user.email ?? null,
      action: "update",
      entity: "studio_payment_settings",
      entity_id: auth.user.id,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }
}
