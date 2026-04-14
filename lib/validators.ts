import { z } from "zod";

// Shared validation schemas for API routes.
export const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  preferredDate: z.string().min(4),
  placement: z.string().min(2),
  description: z.string().min(10),
  slot_id: z.string().optional(),
  slot_label: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  message: z.string().min(10),
});

export const galleryItemSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  style: z.string().min(2),
  image_url: z.string().url(),
  gallery_id: z.string().uuid().optional(),
  tags: z.array(z.string().min(1)).optional(),
  location_link: z.string().url().optional(),
  location_name: z.string().optional(),
  session_length_minutes: z.number().int().positive().optional(),
  aftercare: z.string().optional(),
  sort_order: z.number().int().optional(),
});

export const postSchema = z.object({
  title: z.string().min(2),
  body: z.string().min(10),
  status: z.enum(["draft", "published"]).default("draft"),
  excerpt: z.string().optional(),
  cover_image_url: z.string().url().optional(),
  publish_at: z.string().optional(),
});

export const gallerySchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  slug: z.string().min(2),
});

export const adminProfileSchema = z.object({
  email: z.string().email(),
  nickname: z.string().nullish().transform((v) => v ?? ""),
  shipping_address: z.string().nullish().transform((v) => v ?? ""),
  billing_address: z.string().nullish().transform((v) => v ?? ""),
  payment_notes: z.string().nullish().transform((v) => v ?? ""),
});

export const adminIntegrationSchema = z.object({
  provider: z.string().min(2),
  status: z.enum(["connected", "disconnected", "expired"]).default(
    "disconnected"
  ),
  external_user_id: z.string().optional(),
});

export const adminPaymentSettingsSchema = z.object({
  mode: z.enum(["test", "live"]).default("test"),
  stripe_account_id: z.string().optional(),
  stripe_public_reference: z.string().optional(),
  paypal_merchant_email: z.string().email().optional().or(z.literal("")),
  paypal_merchant_id: z.string().optional(),
  notes: z.string().optional(),
});

export const homepageSectionSchema = z.object({
  section_key: z.string().min(2),
  title: z.string().min(2),
  eyebrow: z.string().optional(),
  body: z.string().max(2000).optional(),
  sort_order: z.number().int().min(0),
  is_visible: z.boolean(),
});

export const homepageSectionsSchema = z.object({
  items: z.array(homepageSectionSchema),
});

export const platformTenantUpdateSchema = z.object({
  tenant_id: z.string().uuid(),
  studio_name: z.string().min(2).max(120).optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
  plan_code: z.enum(["basic", "expanded"]).optional(),
  site_theme: z
    .enum(["atelier", "mono", "ink", "akemi_brutalist", "verdure", "amber"])
    .optional(),
  custom_domain: z.string().min(3).max(255).optional(),
});

export const platformTenantCreateSchema = z.object({
  owner_user_id: z.string().uuid(),
  studio_name: z.string().min(2).max(120),
  slug: z.string().min(2).max(120),
  status: z.enum(["active", "inactive", "suspended"]).default("active"),
  plan_code: z.enum(["basic", "expanded"]).default("basic"),
  site_theme: z
    .enum(["atelier", "mono", "ink", "akemi_brutalist", "verdure", "amber"])
    .optional(),
  custom_domain: z.string().min(3).max(255).optional(),
});

export const platformTenantDeleteSchema = z.object({
  tenant_id: z.string().uuid(),
});

export const platformIntegrationToggleSchema = z.object({
  provider: z.string().min(2),
  is_enabled: z.boolean(),
  maintenance_message: z.string().max(240).optional(),
});
