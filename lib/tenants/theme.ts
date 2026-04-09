import { AKEMI_PILOT, isAkemiPilot } from "./akemi-pilot";

export const DEFAULT_TENANT_THEMES = [
  "atelier",
  "atelier_b",
  "mono",
  "mono_b",
  "ink",
  "ink_b",
  "verdure",
  "verdure_b",
  "amber",
  "amber_b",
] as const;
export const AKEMI_TENANT_THEME = AKEMI_PILOT.theme;
export const AKEMI_TENANT_THEME_B = AKEMI_PILOT.themeAlt;

export type TenantTheme =
  | (typeof DEFAULT_TENANT_THEMES)[number]
  | typeof AKEMI_TENANT_THEME
  | typeof AKEMI_TENANT_THEME_B;

export function isAkemiTenantIdentity(email: string, slug?: string) {
  return isAkemiPilot(email, slug);
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
