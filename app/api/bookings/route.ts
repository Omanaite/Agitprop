import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validators";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendNotificationEmail } from "@/lib/email/resend";
import { sendTelegramMessage, buildBookingTelegramMessage } from "@/lib/telegram";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";

// Ensure Node.js runtime for Supabase + email SDKs in Vercel.
export const runtime = "nodejs";

// Creates a booking request and optionally triggers a notification email.
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
    const limit = rateLimit(`booking:${ip}`, 5, 60_000);
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
    const parsed = bookingSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid booking payload.",
          errors: parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }
    const payload = parsed.data;
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        { message: "Supabase is not configured yet." },
        { status: 503 }
      );
    }
    const client = createSupabaseServerClient();

    // Resolve owner_user_id + notification config from tenantSlug when provided.
    let ownerUserId: string | null = null;
    let tenantTelegramToken: string | null = null;
    let tenantTelegramChatId: string | null = null;
    if (typeof json.tenantSlug === "string" && json.tenantSlug.trim()) {
      const { data: tenantRow } = await client
        .from("artist_tenants")
        .select("owner_user_id,telegram_bot_token,telegram_chat_id")
        .eq("slug", json.tenantSlug.trim())
        .eq("status", "active")
        .maybeSingle();
      ownerUserId = tenantRow?.owner_user_id ?? null;
      tenantTelegramToken = tenantRow?.telegram_bot_token ?? null;
      tenantTelegramChatId = tenantRow?.telegram_chat_id ?? null;
    }

    const { error } = await client.from("bookings").insert({
      name: payload.name,
      email: payload.email,
      preferred_date: payload.preferredDate,
      placement: payload.placement,
      description: payload.description,
      status: "pending",
      owner_user_id: ownerUserId,
    });

    if (error) {
      return NextResponse.json(
        { message: "Failed to save booking request." },
        { status: 500 }
      );
    }

    if (process.env.RESEND_API_KEY) {
      // Try to resolve the artist's email so the notification goes to the right inbox.
      let artistEmail: string | null = null;
      if (ownerUserId) {
        const { data: artistUser } = await client.auth.admin.getUserById(ownerUserId);
        artistEmail = artistUser?.user?.email ?? null;
      }
      const notifyTo = artistEmail ?? process.env.RESEND_TO_EMAIL ?? "studio@akemi.tattoo";

      try {
        // Notify artist
        await sendNotificationEmail({
          to: notifyTo,
          subject: `New booking request from ${payload.name}`,
          html: `
            <p>You have a new booking request.</p>
            <table cellpadding="6" style="font-family:monospace;font-size:14px">
              <tr><td><strong>Name</strong></td><td>${payload.name}</td></tr>
              <tr><td><strong>Email</strong></td><td>${payload.email}</td></tr>
              <tr><td><strong>Preferred date</strong></td><td>${payload.preferredDate}</td></tr>
              <tr><td><strong>Placement</strong></td><td>${payload.placement}</td></tr>
              <tr><td><strong>Description</strong></td><td>${payload.description}</td></tr>
            </table>
            <p>Log in to your studio to manage this request.</p>
          `,
        });
      } catch {
        // Non-blocking
      }

      try {
        // Confirm to client
        await sendNotificationEmail({
          to: payload.email,
          subject: `We received your request — we'll be in touch soon`,
          html: `
            <p>Hi ${payload.name},</p>
            <p>Thanks for reaching out! We've received your booking request and will get back to you as soon as possible.</p>
            <table cellpadding="6" style="font-family:monospace;font-size:14px;margin:16px 0">
              <tr><td><strong>Preferred date</strong></td><td>${payload.preferredDate}</td></tr>
              <tr><td><strong>Placement</strong></td><td>${payload.placement}</td></tr>
              <tr><td><strong>Description</strong></td><td>${payload.description}</td></tr>
            </table>
            <p>We'll review your request and reach out to confirm availability.</p>
          `,
        });
      } catch {
        // Non-blocking
      }
    }

    // Telegram notification (non-blocking)
    if (tenantTelegramToken && tenantTelegramChatId) {
      void sendTelegramMessage(
        tenantTelegramToken,
        tenantTelegramChatId,
        buildBookingTelegramMessage({
          name: payload.name,
          email: payload.email,
          description: payload.description,
          placement: payload.placement,
          preferred_date: payload.preferredDate,
        })
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Invalid booking payload." },
      { status: 400 }
    );
  }
}
