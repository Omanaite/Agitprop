/**
 * Storage tiers for Agitprop.
 *
 * Agitprop is a free, community-supported service for artists.
 * There are no "premium plans" — instead, storage is the only real
 * cost driver. Artists who need more space contribute to server costs.
 *
 * Tier definitions:
 *   "basic"    — default for all artists, covers a small active portfolio.
 *   "expanded" — for artists who upload more content and contribute to
 *                hosting costs (storage on Supabase is not free at scale).
 *
 * Storage estimates (Supabase Free plan = 1 GB total):
 *   ~500 KB avg photo × 25 photos = 12.5 MB per basic artist
 *   ~80 basic artists fit in 1 GB → upgrade to Supabase Pro ($25/mo) around that mark
 *   Artists on expanded tier contribute donations to offset that cost.
 */
export type StorageTier = "basic" | "expanded";

/**
 * Limits and capabilities for each storage tier.
 * Numeric limits reflect realistic storage budgets, not artificial marketing gates.
 * null = no enforced ceiling (expanded tier).
 */
export type TierFeatures = {
  /** Max galleries. Reflects storage cost, not a marketing gate. */
  maxGalleries: number | null;
  /** Max published posts. */
  maxPosts: number | null;
  /** Max pieces per gallery. */
  maxGalleryItems: number | null;
  /** Custom domain support (expanded only — DNS infra cost). */
  customDomain: boolean;
  /** Theme access. All artists get all themes — design is community value. */
  themeSelection: "default" | "full";
  /** Payment settings access (Stripe/PayPal connect). */
  paymentSettings: boolean;
  /** Third-party integrations access (WhatsApp, Telegram, etc.). */
  integrations: boolean;
};

const TIER_FEATURES: Record<StorageTier, TierFeatures> = {
  basic: {
    maxGalleries: 2,
    maxPosts: 5,
    maxGalleryItems: 25,   // ~12 MB per artist at 500 KB avg
    customDomain: false,
    themeSelection: "full", // all themes free — no design gate
    paymentSettings: false,
    integrations: false,
  },
  expanded: {
    maxGalleries: null,
    maxPosts: null,
    maxGalleryItems: null,
    customDomain: true,
    themeSelection: "full",
    paymentSettings: true,
    integrations: true,
  },
};

const TIER_ORDER: StorageTier[] = ["basic", "expanded"];

/**
 * Normalise legacy DB values to current tier names.
 * "free" → "basic", "premium" → "expanded" (backwards compat).
 */
function normaliseTier(planCode: string): StorageTier {
  if (planCode === "free" || planCode === "basic") return "basic";
  if (planCode === "premium" || planCode === "expanded") return "expanded";
  return "basic";
}

/** Returns feature set for a given storage tier. */
export function getTierFeatures(planCode: string): TierFeatures {
  return TIER_FEATURES[normaliseTier(planCode)];
}

/** True when planCode is at least as capable as minimum tier. */
export function isTierAtLeast(planCode: string, minimum: StorageTier): boolean {
  const currentIndex = TIER_ORDER.indexOf(normaliseTier(planCode));
  const minimumIndex = TIER_ORDER.indexOf(minimum);
  if (currentIndex === -1) return false;
  return currentIndex >= minimumIndex;
}

export function canAddGallery(planCode: string, currentCount: number): boolean {
  const { maxGalleries } = getTierFeatures(planCode);
  return maxGalleries === null || currentCount < maxGalleries;
}

export function canAddPost(planCode: string, currentCount: number): boolean {
  const { maxPosts } = getTierFeatures(planCode);
  return maxPosts === null || currentCount < maxPosts;
}

export function canAddGalleryItem(planCode: string, currentCount: number): boolean {
  const { maxGalleryItems } = getTierFeatures(planCode);
  return maxGalleryItems === null || currentCount < maxGalleryItems;
}

export function hasFeature(planCode: string, feature: keyof TierFeatures): boolean {
  const features = getTierFeatures(planCode);
  const value = features[feature];
  if (value === null) return true;
  if (typeof value === "number") return false;
  if (typeof value === "boolean") return value;
  return value !== "default";
}

// Legacy aliases — existing imports keep working during migration.
/** @deprecated Use getTierFeatures */
export const getPlanFeatures = getTierFeatures;
/** @deprecated Use isTierAtLeast */
export const isPlanAtLeast = isTierAtLeast;
/** @deprecated Use StorageTier */
export type PlanCode = StorageTier;
