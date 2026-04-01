import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { sendNotificationEmail } from "@/lib/email/resend";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Ensure Node.js runtime for Resend SDK in Vercel.
export const runtime = "nodejs";

// Sends a contact email using Resend if configured.
export async function POST(request: Request) {
  try {
    const originCheck = enforceSameOrigin(request);
    if (!originCheck.ok) {
      return NextResponse.json(
        { message: "Invalid origin." },
        { status: 403 }
      );
    }
    const ip = getClientIp(request);
    const limit = rateLimit(`contact:${ip}`, 5, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { message: "Too many requests. Try again later." },
        { status: 429 }
      );
    }
    const json = await request.json();
    if (typeof json?.website === "string" && json.website.trim()) {
      return NextResponse.json({ ok: true });
    }
    const parsed = contactSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid contact payload.",
          errors: parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }
    const payload = parsed.data;

    if (process.env.RESEND_API_KEY) {
      let toEmail = process.env.RESEND_TO_EMAIL || "studio@akemi.tattoo";

      if (typeof json.tenantSlug === "string" && json.tenantSlug.trim()) {
        const adminClient = createSupabaseServerClient();
        const { data: tenantRow } = await adminClient
          .from("artist_tenants")
          .select("owner_user_id")
          .eq("slug", json.tenantSlug.trim())
          .eq("status", "active")
          .maybeSingle();
        if (tenantRow?.owner_user_id) {
          const { data: profileRow } = await adminClient
            .from("admin_profiles")
            .select("email")
            .eq("user_id", tenantRow.owner_user_id)
            .maybeSingle();
          if (profileRow?.email) toEmail = profileRow.email;
        }
      }

      const senderName = payload.name ?? payload.email;
      await sendNotificationEmail({
        to: toEmail,
        subject: `New contact message from ${senderName}`,
        html: `<strong>${payload.email}</strong><br/>${payload.message}`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Invalid contact payload." },
      { status: 400 }
    );
  }
}
