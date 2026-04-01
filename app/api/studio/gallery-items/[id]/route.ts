import { NextResponse } from "next/server";
import { galleryItemSchema } from "@/lib/validators";
import { requireArtistOperator } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";
import { logAuditEvent } from "@/lib/audit";

type Params = { params: Promise<{ id: string }> };

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
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

export async function PUT(request: Request, { params }: Params) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }
  const ip = getClientIp(request);
  const limit = rateLimit(`studio-gallery:update:${ip}`, 40, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Try again later." },
      { status: 429 }
    );
  }
  const { id } = await params;
  if (!id || !isUuid(id)) {
    return NextResponse.json(
      { message: "Invalid id." },
      { status: 400 }
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
    const parsed = galleryItemSchema.safeParse(json);
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
    const { error } = await adminClient
      .from("tattoos")
      .update({
        title: payload.title,
        description: payload.description ?? null,
        style: payload.style,
        image_url: payload.image_url,
        gallery_id: payload.gallery_id ?? null,
        tags: payload.tags ?? null,
        location_link: payload.location_link ?? null,
        session_length_minutes: payload.session_length_minutes ?? null,
        aftercare: payload.aftercare ?? null,
        sort_order: payload.sort_order ?? 0,
      })
      .eq("id", id)
      .eq("owner_user_id", auth.user.id);

    if (error) {
      if (isStudioOwnershipSchemaMissing(error)) {
        return NextResponse.json(
          {
            message:
              "Studio gallery items storage is not ready. Run the latest Supabase schema patch.",
            code: "schema_missing",
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        {
          message: "Failed to update gallery item.",
          detail:
            process.env.NODE_ENV === "production" ? undefined : error.message,
        },
        { status: 500 }
      );
    }

    await logAuditEvent({
      actor_email: auth.user?.email ?? null,
      action: "update",
      entity: "tattoos",
      entity_id: id,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Invalid payload." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }
  const ip = getClientIp(request);
  const limit = rateLimit(`studio-gallery:delete:${ip}`, 20, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Try again later." },
      { status: 429 }
    );
  }
  const { id } = await params;
  if (!id || !isUuid(id)) {
    return NextResponse.json(
      { message: "Invalid id." },
      { status: 400 }
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

  const { error } = await adminClient
    .from("tattoos")
    .delete()
    .eq("id", id)
    .eq("owner_user_id", auth.user.id);

  if (error) {
    if (isStudioOwnershipSchemaMissing(error)) {
      return NextResponse.json(
        {
          message:
            "Studio gallery items storage is not ready. Run the latest Supabase schema patch.",
          code: "schema_missing",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      {
        message: "Failed to delete gallery item.",
        detail: process.env.NODE_ENV === "production" ? undefined : error.message,
      },
      { status: 500 }
    );
  }

  await logAuditEvent({
    actor_email: auth.user?.email ?? null,
    action: "delete",
    entity: "tattoos",
    entity_id: id,
  });

  return NextResponse.json({ ok: true });
}


