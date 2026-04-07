import { NextResponse } from "next/server";
import { postSchema } from "@/lib/validators";
import { requireArtistOperator } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";
import { logAuditEvent } from "@/lib/audit";
import { canAddPost } from "@/lib/tenants/plan";

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
  const limit = rateLimit(`studio-posts:list:${ip}`, 60, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ message: "Too many requests. Try again later." }, { status: 429 });
  }
  const auth = await requireArtistOperator();
  if (!auth.ok) {
    return NextResponse.json(
      { message: auth.reason === "forbidden" ? "Forbidden" : "Unauthorized" },
      { status: auth.reason === "forbidden" ? 403 : 401 }
    );
  }
  if (!auth.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const adminClient = createSupabaseServerClient();

  const { data, error } = await adminClient
    .from("posts")
    .select("id,title,body,excerpt,cover_image_url,status,publish_at,created_at,updated_at")
    .eq("owner_user_id", auth.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    if (isStudioOwnershipSchemaMissing(error)) {
      return NextResponse.json({ message: "Studio posts storage is not ready. Run the latest Supabase schema patch.", code: "schema_missing" }, { status: 503 });
    }
    return NextResponse.json({ message: "Failed to load posts.", detail: process.env.NODE_ENV === "production" ? undefined : error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  const ip = getClientIp(request);
  const limit = rateLimit(`studio-posts:create:${ip}`, 20, 60_000);
  if (!limit.allowed) return NextResponse.json({ message: "Too many requests. Try again later." }, { status: 429 });

  const auth = await requireArtistOperator();
  if (!auth.ok) {
    return NextResponse.json(
      { message: auth.reason === "forbidden" ? "Forbidden" : "Unauthorized" },
      { status: auth.reason === "forbidden" ? 403 : 401 }
    );
  }
  if (!auth.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const adminClient = createSupabaseServerClient();

  // Plan enforcement: check post limit before insert.
  const { data: tenantData } = await adminClient
    .from("artist_tenants")
    .select("plan_code")
    .eq("owner_user_id", auth.user.id)
    .maybeSingle();

  const planCode = (tenantData as { plan_code?: string } | null)?.plan_code ?? "free";

  const { count: postCount } = await adminClient
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("owner_user_id", auth.user.id);

  if (!canAddPost(planCode, postCount ?? 0)) {
    return NextResponse.json(
      { message: "Storage limit reached. You have used your basic allocation of posts. Visit your studio to learn about expanded storage.", code: "plan_limit_exceeded" },
      { status: 403 }
    );
  }

  try {
    const json = await request.json();
    const parsed = postSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid payload.", errors: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) },
        { status: 400 }
      );
    }
    const payload = parsed.data;
    const { error } = await adminClient.from("posts").insert({
      title: payload.title,
      body: payload.body,
      status: payload.status ?? "draft",
      excerpt: payload.excerpt ?? null,
      cover_image_url: payload.cover_image_url ?? null,
      publish_at: payload.publish_at ? new Date(payload.publish_at) : null,
      owner_user_id: auth.user.id,
    });

    if (error) {
      if (isStudioOwnershipSchemaMissing(error)) {
        return NextResponse.json({ message: "Studio posts storage is not ready. Run the latest Supabase schema patch.", code: "schema_missing" }, { status: 503 });
      }
      return NextResponse.json({ message: "Failed to create post.", detail: process.env.NODE_ENV === "production" ? undefined : error.message }, { status: 500 });
    }

    await logAuditEvent({ actor_email: auth.user?.email ?? null, action: "create", entity: "posts", metadata: { title: payload.title } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }
}
