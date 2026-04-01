import { NextResponse } from "next/server";
import { gallerySchema } from "@/lib/validators";
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

export async function PUT(request: Request, { params }: Params) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }
  const ip = getClientIp(request);
  const limit = rateLimit(`studio-galleries:update:${ip}`, 40, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  const { id } = await params;
  if (!id || !isUuid(id)) {
    return NextResponse.json({ message: "Invalid id." }, { status: 400 });
  }

  const auth = await requireArtistOperator();
  if (!auth.ok) {
    return NextResponse.json(
      { message: auth.reason === "forbidden" ? "Forbidden" : "Unauthorized" },
      { status: auth.reason === "forbidden" ? 403 : 401 }
    );
  }
  const adminClient = createSupabaseServerClient();

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
  const { error } = await adminClient
    .from("galleries")
    .update({
      title: payload.title,
      description: payload.description ?? null,
      slug: payload.slug,
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      {
        message: "Failed to update gallery.",
        detail: process.env.NODE_ENV === "production" ? undefined : error.message,
      },
      { status: 500 }
    );
  }

  await logAuditEvent({
    actor_email: auth.user?.email ?? null,
    action: "update",
    entity: "galleries",
    entity_id: id,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: Params) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }
  const ip = getClientIp(request);
  const limit = rateLimit(`studio-galleries:delete:${ip}`, 20, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  const { id } = await params;
  if (!id || !isUuid(id)) {
    return NextResponse.json({ message: "Invalid id." }, { status: 400 });
  }

  const auth = await requireArtistOperator();
  if (!auth.ok) {
    return NextResponse.json(
      { message: auth.reason === "forbidden" ? "Forbidden" : "Unauthorized" },
      { status: auth.reason === "forbidden" ? 403 : 401 }
    );
  }
  const adminClient = createSupabaseServerClient();

  const { error } = await adminClient.from("galleries").delete().eq("id", id);
  if (error) {
    return NextResponse.json(
      {
        message: "Failed to delete gallery.",
        detail: process.env.NODE_ENV === "production" ? undefined : error.message,
      },
      { status: 500 }
    );
  }

  await logAuditEvent({
    actor_email: auth.user?.email ?? null,
    action: "delete",
    entity: "galleries",
    entity_id: id,
  });

  return NextResponse.json({ ok: true });
}


