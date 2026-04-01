import { NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/audit";
import { mergeSections } from "@/lib/data/homepage-sections";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";
import { requireArtistOperator } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { homepageSectionsSchema } from "@/lib/validators";

const selection =
  "id,section_key,title,eyebrow,sort_order,is_visible,created_at,updated_at";

function isSchemaDriftError(message: string | undefined) {
  const value = (message ?? "").toLowerCase();
  return (
    value.includes("homepage_sections") ||
    value.includes("does not exist") ||
    value.includes("could not find") ||
    value.includes("column") ||
    value.includes("policy") ||
    value.includes("schema cache")
  );
}

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
  const limit = rateLimit(`studio-homepage-sections:list:${ip}`, 60, 60_000);
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
    .from("homepage_sections")
    .select(selection)
    .eq("owner_user_id", auth.user.id)
    .order("sort_order", { ascending: true });

  if (error) {
    if (isStudioOwnershipSchemaMissing(error)) {
      return NextResponse.json(
        {
          items: mergeSections([]),
          degraded: true,
          message:
            "Studio homepage composition storage is not ready. Run the latest Supabase schema patch.",
          code: "schema_missing",
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        items: mergeSections([]),
        degraded: true,
        message:
          "Homepage composition fallback loaded. Apply the latest Supabase schema to enable persistence.",
        detail: process.env.NODE_ENV === "production" ? undefined : error.message,
      },
      { status: 200 }
    );
  }

  return NextResponse.json({ items: mergeSections(data ?? []) });
}

export async function PUT(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }

  const ip = getClientIp(request);
  const limit = rateLimit(`studio-homepage-sections:update:${ip}`, 20, 60_000);
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

  try {
    const json = await request.json();
    const parsed = homepageSectionsSchema.safeParse(json);
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

    const payload = parsed.data.items.map((item, index) => ({
      owner_user_id: auth.user.id,
      section_key: item.section_key,
      title: item.title.trim(),
      eyebrow: item.eyebrow?.trim() ? item.eyebrow.trim() : null,
      sort_order: index,
      is_visible: item.is_visible,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await adminClient
      .from("homepage_sections")
      .upsert(payload, { onConflict: "owner_user_id,section_key" });

    if (error) {
      if (isSchemaDriftError(error.message) || isStudioOwnershipSchemaMissing(error)) {
        return NextResponse.json(
          {
            items: mergeSections(payload),
            degraded: true,
            message:
              "Cannot save homepage composition yet. Apply the latest Supabase schema in production first.",
            detail:
              process.env.NODE_ENV === "production" ? undefined : error.message,
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          message: "Failed to save homepage sections.",
          detail:
            process.env.NODE_ENV === "production" ? undefined : error.message,
        },
        { status: 500 }
      );
    }

    await logAuditEvent({
      actor_email: auth.user?.email ?? null,
      action: "update",
      entity: "homepage_sections",
      metadata: {
        updated_keys: payload.map((item) => item.section_key),
      },
    });

    const { data, error: reloadError } = await adminClient
      .from("homepage_sections")
      .select(selection)
      .eq("owner_user_id", auth.user.id)
      .order("sort_order", { ascending: true });

    if (reloadError) {
      return NextResponse.json({ ok: true, items: mergeSections(payload) });
    }

    return NextResponse.json({ ok: true, items: mergeSections(data ?? []) });
  } catch {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }
}


