import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validators";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendNotificationEmail } from "@/lib/email/resend";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

// Ensure Node.js runtime for Supabase + email SDKs in Vercel.
export const runtime = "nodejs";

// Creates a booking request and optionally triggers a notification email.
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`booking:${ip}`, 5, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { message: "Too many requests. Try again later." },
        { status: 429 }
      );
    }
    const json = await request.json();
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

    const { error } = await client.from("bookings").insert({
      name: payload.name,
      email: payload.email,
      preferred_date: payload.preferredDate,
      placement: payload.placement,
      description: payload.description,
      status: "pending",
    });

    if (error) {
      return NextResponse.json(
        { message: "Failed to save booking request." },
        { status: 500 }
      );
    }

    if (process.env.RESEND_API_KEY) {
      await sendNotificationEmail({
        to: process.env.RESEND_TO_EMAIL || "studio@akemi.tattoo",
        subject: "New booking request",
        html: `<strong>${payload.name}</strong> requested a session on <strong>${payload.preferredDate}</strong>.`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid booking payload." },
      { status: 400 }
    );
  }
}
