export const DEFAULT_TENANT_THEMES = ["atelier", "mono", "ink"] as const;
export const AKEMI_TENANT_THEME = "akemi_brutalist" as const;

export type TenantTheme =
  | (typeof DEFAULT_TENANT_THEMES)[number]
  | typeof AKEMI_TENANT_THEME;

const AKEMI_EMAIL = "akemi@tattoo.ink";
const AKEMI_SLUG = "akemi";

export function isAkemiTenantIdentity(email: string, slug?: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedSlug = (slug ?? "").trim().toLowerCase();
  return normalizedEmail === AKEMI_EMAIL || normalizedSlug === AKEMI_SLUG;
}

export function sanitizeTenantTheme(
  theme: string | null | undefined,
  isAkemiTenant: boolean
): TenantTheme {
  if (isAkemiTenant) return AKEMI_TENANT_THEME;
  if (!theme) return DEFAULT_TENANT_THEMES[0];
  if (theme === AKEMI_TENANT_THEME) return DEFAULT_TENANT_THEMES[0];
  if (
    DEFAULT_TENANT_THEMES.includes(
      theme as (typeof DEFAULT_TENANT_THEMES)[number]
    )
  ) {
    return theme as TenantTheme;
  }
  return DEFAULT_TENANT_THEMES[0];
}
