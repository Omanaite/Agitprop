import { NextResponse } from "next/server";
import { adminProfileSchema } from "@/lib/validators";
import { requireArtistOperator } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";
import { logAuditEvent } from "@/lib/audit";
import {
  sanitizeTenantTheme,
  isAkemiTenantIdentity,
} from "@/lib/tenants/theme";

function isMissingProfileTable(error: { code?: string; message?: string } | null) {
  const code = String(error?.code ?? "");
  const message = String(error?.message ?? "").toLowerCase();
  return (
    code === "42P01" ||
    code === "PGRST205" ||
    message.includes("relation \"admin_profiles\"") ||
    (message.includes("relation") && message.includes("does not exist"))
  );
}

function isRecoverableProfileReadError(error: {
  code?: string;
  message?: string;
} | null) {
  const code = String(error?.code ?? "");
  const message = String(error?.message ?? "").toLowerCase();
  return (
    isMissingProfileTable(error) ||
    code === "42703" ||
    code === "42501" ||
    message.includes("permission denied") ||
    message.includes("insufficient privilege") ||
    message.includes("column")
  );
}

export async function GET(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }
  const ip = getClientIp(request);
  const limit = rateLimit(`studio-profile:get:${ip}`, 60, 60_000);
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
  const user = auth.user;
  const adminClient = createSupabaseServerClient();

  const { data, error } = await adminClient
    .from("admin_profiles")
    .select("email,nickname,shipping_address,billing_address,payment_notes")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    if (isRecoverableProfileReadError(error)) {
      return NextResponse.json({
        profile: {
          email: user.email ?? "",
          nickname: "",
          shipping_address: "",
          billing_address: "",
          payment_notes: "",
          site_theme: "atelier",
        },
        fallback: true,
      });
    }
    return NextResponse.json(
      {
        message: "Failed to load profile.",
        detail: process.env.NODE_ENV === "production" ? undefined : error.message,
      },
      { status: 500 }
    );
  }

  const { data: tenantData } = await adminClient
    .from("artist_tenants")
    .select("site_theme,slug")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  const siteTheme = tenantData?.site_theme ?? "atelier";
  const tenantSlug = tenantData?.slug ?? null;

  return NextResponse.json({
    profile: {
      ...(data ?? {
        email: user.email ?? "",
        nickname: "",
        shipping_address: "",
        billing_address: "",
        payment_notes: "",
      }),
      site_theme: siteTheme,
      slug: tenantSlug,
    },
  });
}

export async function PATCH(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }
  const ip = getClientIp(request);
  const limit = rateLimit(`studio-profile:patch:${ip}`, 30, 60_000);
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
  const user = auth.user;

  try {
    const json = await request.json();

    if (typeof json.slug === "string") {
      const raw = json.slug.trim().toLowerCase();
      const slugRe = /^[a-z0-9][a-z0-9-]{0,48}[a-z0-9]$|^[a-z0-9]{2,50}$/;
      if (!slugRe.test(raw)) {
        return NextResponse.json(
          { message: "Page name must be 2–50 characters: lowercase letters, numbers, and hyphens only (no leading/trailing hyphens)." },
          { status: 400 }
        );
      }

      const adminClient = createSupabaseServerClient();

      // Uniqueness check — exclude current user's own tenant.
      const { data: existing } = await adminClient
        .from("artist_tenants")
        .select("owner_user_id")
        .eq("slug", raw)
        .neq("owner_user_id", user.id)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { message: "That page name is already taken. Choose a different one." },
          { status: 409 }
        );
      }

      const { error } = await adminClient
        .from("artist_tenants")
        .update({ slug: raw })
        .eq("owner_user_id", user.id);

      if (error) {
        return NextResponse.json(
          { message: "Failed to update page name.", detail: process.env.NODE_ENV === "production" ? undefined : error.message },
          { status: 500 }
        );
      }

      await logAuditEvent({
        actor_email: user.email ?? null,
        action: "update",
        entity: "artist_tenants",
        entity_id: user.id,
        metadata: { slug: raw },
      });

      return NextResponse.json({ ok: true, slug: raw });
    }

    if (typeof json.site_theme === "string") {
      const adminClient = createSupabaseServerClient();

      const { data: tenantData } = await adminClient
        .from("artist_tenants")
        .select("slug")
        .eq("owner_user_id", user.id)
        .maybeSingle();

      const isAkemi = isAkemiTenantIdentity(
        user.email ?? "",
        tenantData?.slug ?? ""
      );
      const safeTheme = sanitizeTenantTheme(json.site_theme, isAkemi);

      const { error } = await adminClient
        .from("artist_tenants")
        .update({ site_theme: safeTheme })
        .eq("owner_user_id", user.id);

      if (error) {
        return NextResponse.json(
          {
            message: "Failed to update site theme.",
            detail:
              process.env.NODE_ENV === "production" ? undefined : error.message,
          },
          { status: 500 }
        );
      }

      await logAuditEvent({
        actor_email: user.email ?? null,
        action: "update",
        entity: "artist_tenants",
        entity_id: user.id,
      });

      return NextResponse.json({ ok: true, site_theme: safeTheme });
    }

    return NextResponse.json(
      { message: "No recognized fields to update." },
      { status: 400 }
    );
  } catch {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }
  const ip = getClientIp(request);
  const limit = rateLimit(`studio-profile:update:${ip}`, 30, 60_000);
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
  const user = auth.user;

  try {
    const json = await request.json();
    const parsed = adminProfileSchema.safeParse(json);
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
      .from("admin_profiles")
      .upsert(
        {
          user_id: user.id,
          email: payload.email,
          nickname: payload.nickname ?? null,
          shipping_address: payload.shipping_address ?? null,
          billing_address: payload.billing_address ?? null,
          payment_notes: payload.payment_notes ?? null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      );

    if (error) {
      if (isMissingProfileTable(error)) {
        return NextResponse.json(
          {
            message:
              "Profile storage is not ready. Run the latest Supabase schema first.",
            code: "schema_missing",
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        {
          message: "Failed to update profile.",
          detail:
            process.env.NODE_ENV === "production" ? undefined : error.message,
        },
        { status: 500 }
      );
    }

    await logAuditEvent({
      actor_email: user.email ?? null,
      action: "update",
      entity: "studio_profiles",
      entity_id: user.id,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }
}
