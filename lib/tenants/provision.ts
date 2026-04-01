import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAkemiTenantIdentity, sanitizeTenantTheme } from "@/lib/tenants/theme";

type ProvisionInput = {
  userId: string;
  email: string;
  appMetadata?: Record<string, unknown> | null;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function isPlatformRole(appMetadata?: Record<string, unknown> | null) {
  if (!appMetadata) return false;
  const role = String(appMetadata.role ?? "").toLowerCase();
  const roles = Array.isArray(appMetadata.roles)
    ? appMetadata.roles.map((item) => String(item).toLowerCase())
    : [];

  return role === "admin" || role === "platform_admin" || roles.includes("admin") || roles.includes("platform_admin");
}

function isSchemaMissing(error: { code?: string; message?: string } | null) {
  const code = String(error?.code ?? "");
  const message = String(error?.message ?? "").toLowerCase();
  return (
    code === "42P01" ||
    code === "PGRST205" ||
    message.includes("artist_tenants") ||
    message.includes("tenant_memberships")
  );
}

async function getUniqueSlug(supabase: ReturnType<typeof createSupabaseServerClient>, base: string) {
  const normalized = slugify(base) || "artist";
  for (let i = 0; i < 20; i += 1) {
    const candidate = i === 0 ? normalized : `${normalized}-${i + 1}`;
    const { data, error } = await supabase
      .from("artist_tenants")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      if (isSchemaMissing(error)) return null;
      throw error;
    }

    if (!data) return candidate;
  }

  return `${normalized}-${Date.now().toString().slice(-6)}`;
}

export async function ensureArtistTenantProvisioned(input: ProvisionInput) {
  if (!input.userId || !input.email) return { ok: false, skipped: true as const };
  if (isPlatformRole(input.appMetadata)) {
    return { ok: true, skipped: true as const };
  }

  const supabase = createSupabaseServerClient();

  const { data: existingTenant, error: existingTenantError } = await supabase
    .from("artist_tenants")
    .select("id,plan_code")
    .eq("owner_user_id", input.userId)
    .maybeSingle();

  if (existingTenantError) {
    if (isSchemaMissing(existingTenantError)) {
      return { ok: false, schemaMissing: true as const };
    }
    throw existingTenantError;
  }

  let tenantId = existingTenant?.id;
  if (!tenantId) {
    const emailPrefix = input.email.split("@")[0] || "artist";
    const slug = await getUniqueSlug(supabase, emailPrefix);
    if (!slug) return { ok: false, schemaMissing: true as const };

    const isAkemiTenant = isAkemiTenantIdentity(input.email, slug);
    const planCode = isAkemiTenant ? "premium" : "free";
    const studioName = isAkemiTenant ? "Akemi Tattoo" : `${emailPrefix} Studio`;
    const siteTheme = sanitizeTenantTheme(undefined, isAkemiTenant);

    const { data: insertedTenant, error: createTenantError } = await supabase
      .from("artist_tenants")
      .insert({
        owner_user_id: input.userId,
        studio_name: studioName,
        slug,
        status: "active",
        plan_code: planCode,
        site_theme: siteTheme,
      })
      .select("id")
      .single();

    if (createTenantError) {
      if (isSchemaMissing(createTenantError)) {
        return { ok: false, schemaMissing: true as const };
      }
      throw createTenantError;
    }

    tenantId = insertedTenant.id;
  }

  if (!tenantId) return { ok: false };

  const { error: membershipError } = await supabase
    .from("tenant_memberships")
    .upsert(
      {
        tenant_id: tenantId,
        user_id: input.userId,
        role: "artist_admin",
        status: "active",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "tenant_id,user_id" }
    );

  if (membershipError) {
    if (isSchemaMissing(membershipError)) {
      return { ok: false, schemaMissing: true as const };
    }
    throw membershipError;
  }

  return { ok: true, tenantId };
}
