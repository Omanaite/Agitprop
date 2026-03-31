import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";
import { platformIntegrationToggleSchema } from "@/lib/validators";
import { logAuditEvent } from "@/lib/audit";

function isMissingIntegrationSchema(error: { code?: string; message?: string } | null) {
  const code = String(error?.code ?? "");
  const message = String(error?.message ?? "").toLowerCase();
  return (
    code === "42P01" ||
    code === "PGRST205" ||
    message.includes("platform_integrations") ||
    (message.includes("relation") && message.includes("does not exist"))
  );
}

const defaults = [
  {
    provider: "supabase_storage",
    is_enabled: true,
    maintenance_message: "",
  },
  {
    provider: "google_oauth",
    is_enabled: true,
    maintenance_message: "",
  },
  {
    provider: "github_oauth",
    is_enabled: true,
    maintenance_message: "",
  },
];

export async function GET(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }
  const ip = getClientIp(request);
  const limit = rateLimit(`admin-platform-integrations:get:${ip}`, 60, 60_000);
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
  const user = auth.user;
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await auth.supabase
    .from("platform_integrations")
    .select("provider,is_enabled,maintenance_message,updated_at")
    .order("provider", { ascending: true });

  if (error) {
    if (isMissingIntegrationSchema(error)) {
      return NextResponse.json({
        integrations: defaults,
        fallback: true,
        warning: "platform_integrations schema missing in target environment.",
      });
    }
    return NextResponse.json(
      {
        message: "Failed to load platform integrations.",
        detail: process.env.NODE_ENV === "production" ? undefined : error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ integrations: data ?? [] });
}

export async function PUT(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }
  const ip = getClientIp(request);
  const limit = rateLimit(`admin-platform-integrations:update:${ip}`, 30, 60_000);
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
  const user = auth.user;
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await request.json();
    const parsed = platformIntegrationToggleSchema.safeParse(json);
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
      .from("platform_integrations")
      .upsert(
        {
          provider: payload.provider,
          is_enabled: payload.is_enabled,
          maintenance_message: payload.maintenance_message ?? null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "provider",
        }
      );

    if (error) {
      if (isMissingIntegrationSchema(error)) {
        return NextResponse.json(
          {
            message:
              "Platform integrations storage is not ready. Run the latest Supabase schema first.",
            code: "schema_missing",
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        {
          message: "Failed to update platform integration.",
          detail: process.env.NODE_ENV === "production" ? undefined : error.message,
        },
        { status: 500 }
      );
    }

    await logAuditEvent({
      actor_email: user.email ?? null,
      action: "update",
      entity: "platform_integrations",
      metadata: payload,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }
}
