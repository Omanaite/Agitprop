"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createSupabaseServerClient as createAdminClient } from "@/lib/supabase/server";
import { getClientIpFromHeaders, rateLimit } from "@/lib/rate-limit";
import { ensureArtistTenantProvisioned } from "@/lib/tenants/provision";

const registerSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must have at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"email" | "password" | "confirmPassword", string>>;
};

export async function signUpUser(
  _prevState: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> {
  const parsed = registerSchema.safeParse({
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
    confirmPassword: String(formData.get("confirmPassword") || ""),
  });

  const honeypot = String(formData.get("website") || "");
  if (honeypot.trim()) {
    return { status: "success", message: "Account created. You can now sign in." };
  }

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      fieldErrors: {
        email: errors.email?.[0],
        password: errors.password?.[0],
        confirmPassword: errors.confirmPassword?.[0],
      },
    };
  }

  try {
    const headerStore = await headers();
    const ip = getClientIpFromHeaders(headerStore);
    const limit = rateLimit(`register:${ip}`, 5, 60_000);
    if (!limit.allowed) {
      return { status: "error", message: "Too many attempts. Please try again later." };
    }

    const adminClient = createAdminClient();

    // Check if user already exists before attempting to create.
    const { data: existing } = await adminClient.auth.admin.listUsers();
    const alreadyExists = existing?.users?.some(
      (u) => u.email?.toLowerCase() === parsed.data.email.toLowerCase()
    );
    if (alreadyExists) {
      return {
        status: "error",
        message: "This email already has an account. Try signing in instead.",
      };
    }

    // Create user via admin API — no SMTP call, instant email confirmation.
    const { data, error } = await adminClient.auth.admin.createUser({
      email: parsed.data.email,
      password: parsed.data.password,
      email_confirm: true,
      user_metadata: { signup_source: "register_page" },
    });

    if (error) {
      const message = error.message.toLowerCase();
      if (message.includes("already") || message.includes("registered") || message.includes("exists")) {
        return {
          status: "error",
          message: "This email already has an account. Try signing in instead.",
        };
      }
      if (message.includes("rate") || message.includes("too many")) {
        return { status: "error", message: "Too many attempts. Please try again later." };
      }
      return { status: "error", message: "We could not create the account right now." };
    }

    if (data.user?.id && data.user.email) {
      try {
        await ensureArtistTenantProvisioned({
          userId: data.user.id,
          email: data.user.email,
          appMetadata: data.user.app_metadata,
        });
      } catch {
        // Non-fatal — tenant can be provisioned on first login.
      }
    }

    return { status: "success", message: "Account created. You can now sign in." };
  } catch {
    return { status: "error", message: "Unexpected server error while creating the account." };
  }
}
