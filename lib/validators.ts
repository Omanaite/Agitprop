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
