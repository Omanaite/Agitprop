/** Plan codes supported by the platform. */
export type PlanCode = "free" | "premium";

/**
 * Feature flags and limits for a given plan.
 * `null` means unlimited (no enforced ceiling).
 */
export type PlanFeatures = {
  /** Maximum number of galleries allowed. null = unlimited. */
  maxGalleries: number | null;
  /** Maximum number of posts allowed. null = unlimited. */
  maxPosts: number | null;
  /** Maximum number of items per gallery. null = unlimited. */
  maxGalleryItems: number | null;
  /** Whether the tenant may connect a custom domain. */
  customDomain: boolean;
  /** Theme access level: "default" = curated set only, "full" = all themes. */
  themeSelection: "default" | "full";
  /** Whether payment settings are accessible. */
  paymentSettings: boolean;
  /** Whether third-party integrations are accessible. */
  integrations: boolean;
};

/** Plan feature definitions keyed by PlanCode. */
const PLAN_FEATURES: Record<PlanCode, PlanFeatures> = {
  free: {
    maxGalleries: 3,
    maxPosts: 10,
    maxGalleryItems: 20,
    customDomain: false,
    themeSelection: "default",
    paymentSettings: false,
    integrations: false,
  },
  premium: {
    maxGalleries: null,
    maxPosts: null,
    maxGalleryItems: null,
    customDomain: true,
    themeSelection: "full",
    paymentSettings: true,
    integrations: true,
  },
};

/** Ordered list of plans from least to most capable. */
const PLAN_ORDER: PlanCode[] = ["free", "premium"];

/**
 * Returns the full feature set for a given plan code.
 * Falls back to `free` features for any unrecognised value.
 *
 * @param planCode - The plan code to look up.
 * @returns The {@link PlanFeatures} for that plan.
 */
export function getPlanFeatures(planCode: string): PlanFeatures {
  const key = planCode as PlanCode;
  return PLAN_FEATURES[key] ?? PLAN_FEATURES.free;
}

/**
 * Returns `true` when `planCode` is at least as capable as `minimum`.
 * Useful for guard clauses such as `isPlanAtLeast(tenant.plan_code, "premium")`.
 *
 * @param planCode - The plan code to evaluate.
 * @param minimum  - The minimum required plan code.
 */
export function isPlanAtLeast(planCode: string, minimum: PlanCode): boolean {
  const currentIndex = PLAN_ORDER.indexOf(planCode as PlanCode);
  const minimumIndex = PLAN_ORDER.indexOf(minimum);
  if (currentIndex === -1) return false;
  return currentIndex >= minimumIndex;
}

/**
 * Returns `true` when the tenant may create an additional gallery.
 *
 * @param planCode     - The tenant's plan code.
 * @param currentCount - The number of galleries the tenant currently has.
 */
export function canAddGallery(planCode: string, currentCount: number): boolean {
  const { maxGalleries } = getPlanFeatures(planCode);
  if (maxGalleries === null) return true;
  return currentCount < maxGalleries;
}

/**
 * Returns `true` when the tenant may create an additional post.
 *
 * @param planCode     - The tenant's plan code.
 * @param currentCount - The number of posts the tenant currently has.
 */
export function canAddPost(planCode: string, currentCount: number): boolean {
  const { maxPosts } = getPlanFeatures(planCode);
  if (maxPosts === null) return true;
  return currentCount < maxPosts;
}

/**
 * Returns `true` when the tenant may add another item to a gallery.
 *
 * @param planCode     - The tenant's plan code.
 * @param currentCount - The number of items already in the gallery.
 */
export function canAddGalleryItem(
  planCode: string,
  currentCount: number
): boolean {
  const { maxGalleryItems } = getPlanFeatures(planCode);
  if (maxGalleryItems === null) return true;
  return currentCount < maxGalleryItems;
}

/**
 * Returns the value of a specific feature flag for the given plan.
 * For numeric limits (`maxGalleries`, `maxPosts`, `maxGalleryItems`),
 * returns `true` when the limit is unlimited (`null`) and `false` when
 * a finite ceiling is imposed. For boolean and string features the
 * truthiness of the stored value is returned.
 *
 * @param planCode - The tenant's plan code.
 * @param feature  - The key of the feature to check.
 */
export function hasFeature(
  planCode: string,
  feature: keyof PlanFeatures
): boolean {
  const features = getPlanFeatures(planCode);
  const value = features[feature];
  if (value === null) return true;   // null numeric limit = unlimited = enabled
  if (typeof value === "number") return false; // finite limit = restricted
  if (typeof value === "boolean") return value;
  // string discriminants — treat non-"default" as enabled/full
  return value !== "default";
}
