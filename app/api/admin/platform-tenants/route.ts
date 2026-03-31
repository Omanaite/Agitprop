import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";
import { platformTenantUpdateSchema } from "@/lib/validators";
import { logAuditEvent } from "@/lib/audit";

function isMissingTenantSchema(error: { code?: string; message?: string } | null) {
  const code = String(error?.code ?? "");
  const message = String(error?.message ?? "").toLowerCase();
  return (
    code === "42P01" ||
    code === "PGRST205" ||
    message.includes("artist_tenants") ||
    message.includes("tenant_memberships") ||
    (message.includes("relation") && message.includes("does not exist"))
  );
}

export async function GET(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }
  const ip = getClientIp(request);
  const limit = rateLimit(`admin-platform-tenants:get:${ip}`, 60, 60_000);
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
    .from("artist_tenants")
    .select("id,studio_name,slug,status,plan_code,owner_user_id,created_at,updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingTenantSchema(error)) {
      return NextResponse.json({
        tenants: [],
        fallback: true,
        warning: "artist_tenants schema missing in target environment.",
      });
    }
    return NextResponse.json(
      {
        message: "Failed to load tenants.",
        detail: process.env.NODE_ENV === "production" ? undefined : error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ tenants: data ?? [] });
}

export async function PUT(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }
  const ip = getClientIp(request);
  const limit = rateLimit(`admin-platform-tenants:update:${ip}`, 30, 60_000);
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
    const parsed = platformTenantUpdateSchema.safeParse(json);
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
    const updates: Record<string, string> = {
      updated_at: new Date().toISOString(),
    };

    if (payload.studio_name !== undefined) {
      updates.studio_name = payload.studio_name;
    }
    if (payload.status !== undefined) {
      updates.status = payload.status;
    }
    if (payload.plan_code !== undefined) {
      updates.plan_code = payload.plan_code;
    }

    const { error } = await auth.supabase
      .from("artist_tenants")
      .update(updates)
      .eq("id", payload.tenant_id);

    if (error) {
      if (isMissingTenantSchema(error)) {
        return NextResponse.json(
          {
            message: "Tenant storage is not ready. Run the latest Supabase schema first.",
            code: "schema_missing",
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        {
          message: "Failed to update tenant.",
          detail: process.env.NODE_ENV === "production" ? undefined : error.message,
        },
        { status: 500 }
      );
    }

    await logAuditEvent({
      actor_email: user.email ?? null,
      action: "update",
      entity: "artist_tenants",
      entity_id: payload.tenant_id,
      metadata: updates,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }
}
