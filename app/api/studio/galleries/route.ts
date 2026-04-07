import { NextResponse } from "next/server";
import { gallerySchema } from "@/lib/validators";
import { requireArtistOperator } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";
import { logAuditEvent } from "@/lib/audit";
import { canAddGallery } from "@/lib/tenants/plan";

function isStudioOwnershipSchemaMissing(error: { code?: string; message?: string } | null) {
  const code = String(error?.code ?? "");
  const message = String(error?.message ?? "").toLowerCase();
  return (
    code === "42703" ||
    code === "42P01" ||
    code === "PGRST204" ||
    message.includes("owner_user_id") ||
    message.includes("does not exist")
  );
}

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`studio-galleries:list:${ip}`, 60, 60_000);
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
    .from("galleries")
    .select("id,title,description,slug,created_at")
    .eq("owner_user_id", auth.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    if (isStudioOwnershipSchemaMissing(error)) {
      return NextResponse.json(
        {
          message:
            "Studio galleries storage is not ready. Run the latest Supabase schema patch.",
          code: "schema_missing",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      {
        message: "Failed to load galleries.",
        detail: process.env.NODE_ENV === "production" ? undefined : error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }
  const ip = getClientIp(request);
  const limit = rateLimit(`studio-galleries:create:${ip}`, 20, 60_000);
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

  // Plan enforcement: check gallery limit before insert.
  const { data: tenantData } = await adminClient
    .from("artist_tenants")
    .select("plan_code")
    .eq("owner_user_id", auth.user.id)
    .maybeSingle();

  const planCode = (tenantData as { plan_code?: string } | null)?.plan_code ?? "free";

  const { count: galleryCount } = await adminClient
    .from("galleries")
    .select("id", { count: "exact", head: true })
    .eq("owner_user_id", auth.user.id);

  if (!canAddGallery(planCode, galleryCount ?? 0)) {
    return NextResponse.json(
      {
        message: "Storage limit reached. You have used your basic allocation. Visit your studio to learn about expanded storage.",
        code: "plan_limit_exceeded",
      },
      { status: 403 }
    );
  }

  try {
    const json = await request.json();
    const parsed = gallerySchema.safeParse(json);
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
    const { error } = await adminClient.from("galleries").insert({
      title: payload.title,
      description: payload.description ?? null,
      slug: payload.slug,
      owner_user_id: auth.user.id,
    });

    if (error) {
      if (isStudioOwnershipSchemaMissing(error)) {
        return NextResponse.json(
          {
            message:
              "Studio galleries storage is not ready. Run the latest Supabase schema patch.",
            code: "schema_missing",
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        {
          message: "Failed to create gallery.",
          detail:
            process.env.NODE_ENV === "production" ? undefined : error.message,
        },
        { status: 500 }
      );
    }

    await logAuditEvent({
      actor_email: auth.user?.email ?? null,
      action: "create",
      entity: "galleries",
      metadata: { title: payload.title, slug: payload.slug },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Invalid payload." },
      { status: 400 }
    );
  }
}
