"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/ssr";
import { getSiteUrl } from "@/lib/site-url";

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
    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient({
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach((cookie) => cookieStore.set(cookie));
      },
    });

    const emailRedirectTo = `${getSiteUrl()}/register/complete?source=email`;
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo,
        data: {
          signup_source: "register_page",
        },
      },
    });

    if (error) {
      const message = error.message.toLowerCase();
      if (message.includes("already") || message.includes("registered")) {
        return {
          status: "error",
          message: "This email already has an account. Try OAuth or sign in instead.",
        };
      }
      if (message.includes("rate") || message.includes("too many")) {
        return {
          status: "error",
          message: "Too many attempts. Please try again later.",
        };
      }

      return {
        status: "error",
        message: "We could not create the account right now.",
      };
    }

    if (data.session) {
      await supabase.auth.signOut();
    }

    return {
      status: "success",
      message:
        "Account created. Check your inbox and confirm the email before signing in.",
    };
  } catch {
    return {
      status: "error",
      message: "Unexpected server error while creating the account.",
    };
  }
}
