import { z } from "zod";

// Shared validation schemas for API routes.
export const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  preferredDate: z.string().min(4),
  placement: z.string().min(2),
  description: z.string().min(10),
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
