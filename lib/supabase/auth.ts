import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/ssr";
import type { User } from "@supabase/supabase-js";

function getAdminAllowlist() {
  const envAllowlist = String(process.env.ADMIN_EMAIL_ALLOWLIST || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const pilotAllowlist = [
    "pchandia@hotmail.com",
    "chandiapablo@outlook.com",
    "akemi@tattoo.ink",
  ];
  return Array.from(new Set([...envAllowlist, ...pilotAllowlist]));
}

export function isAdminUser(user: User) {
  return isPlatformAdmin(user);
}

export function getUserRoles(user: User) {
  const appMetadata = user.app_metadata ?? {};
  const role = String(appMetadata.role ?? "").toLowerCase();
  const roles = Array.isArray(appMetadata.roles)
    ? appMetadata.roles.map((item: unknown) => String(item).toLowerCase())
    : [];
  return Array.from(new Set([role, ...roles].filter(Boolean)));
}

export function isPlatformAdmin(user: User) {
  const roles = getUserRoles(user);
  const email = String(user.email ?? "").toLowerCase();
  const allowlist = getAdminAllowlist();

  if (roles.includes("admin")) return true;
  if (roles.includes("platform_admin")) return true;
  if (allowlist.length > 0 && allowlist.includes(email)) return true;

  return false;
}

export function isArtistOperator(user: User) {
  const roles = getUserRoles(user);
  return (
    roles.includes("artist") ||
    roles.includes("artist_admin") ||
    roles.includes("studio_manager")
  );
}

export function getUserConsoleRoute(user: User) {
  if (isPlatformAdmin(user)) return "/admin";
  if (isArtistOperator(user)) return "/studio";
  return null;
}

export async function requireAdmin() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach((cookie) => cookieStore.set(cookie));
    },
  });

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { ok: false, supabase, reason: "unauthenticated" as const };
  }

  if (!isPlatformAdmin(data.user)) {
    return { ok: false, supabase, reason: "forbidden" as const };
  }

  return { ok: true, supabase, user: data.user };
}

export async function requireArtistOperator() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach((cookie) => cookieStore.set(cookie));
    },
  });

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { ok: false, supabase, reason: "unauthenticated" as const };
  }

  if (!isArtistOperator(data.user)) {
    return { ok: false, supabase, reason: "forbidden" as const };
  }

  return { ok: true, supabase, user: data.user };
}
