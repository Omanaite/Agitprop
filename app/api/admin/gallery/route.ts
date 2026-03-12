import { NextResponse } from "next/server";
import { galleryItemSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/supabase/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`admin-gallery:list:${ip}`, 60, 60_000);
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
    .from("tattoos")
    .select("id,title,description,style,image_url,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      {
        message: "Failed to load gallery.",
        detail: process.env.NODE_ENV === "production" ? undefined : error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`admin-gallery:create:${ip}`, 20, 60_000);
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
    const { error } = await auth.supabase.from("tattoos").insert({
      title: payload.title,
      description: payload.description ?? null,
      style: payload.style,
      image_url: payload.image_url,
      gallery_id: payload.gallery_id ?? null,
    });

    if (error) {
      return NextResponse.json(
        {
          message: "Failed to create gallery item.",
          detail:
            process.env.NODE_ENV === "production" ? undefined : error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Invalid payload." },
      { status: 400 }
    );
  }
}
