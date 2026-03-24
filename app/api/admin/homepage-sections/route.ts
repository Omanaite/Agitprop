import { NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/audit";
import { mergeSections } from "@/lib/data/homepage-sections";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";
import { requireAdmin } from "@/lib/supabase/auth";
import { homepageSectionsSchema } from "@/lib/validators";

const selection =
  "id,section_key,title,eyebrow,sort_order,is_visible,created_at,updated_at";

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`admin-homepage-sections:list:${ip}`, 60, 60_000);
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
    .from("homepage_sections")
    .select(selection)
    .order("sort_order", { ascending: true });

  if (error) {
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
  const limit = rateLimit(`admin-homepage-sections:update:${ip}`, 20, 60_000);
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
      section_key: item.section_key,
      title: item.title.trim(),
      eyebrow: item.eyebrow?.trim() ? item.eyebrow.trim() : null,
      sort_order: index,
      is_visible: item.is_visible,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await auth.supabase
      .from("homepage_sections")
      .upsert(payload, { onConflict: "section_key" });

    if (error) {
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

    const { data, error: reloadError } = await auth.supabase
      .from("homepage_sections")
      .select(selection)
      .order("sort_order", { ascending: true });

    if (reloadError) {
      return NextResponse.json({ ok: true, items: mergeSections(payload) });
    }

    return NextResponse.json({ ok: true, items: mergeSections(data ?? []) });
  } catch {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }
}
