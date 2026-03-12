import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validators";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendNotificationEmail } from "@/lib/email/resend";

// Creates a booking request and optionally triggers a notification email.
export async function POST(request: Request) {
  try {
    const payload = bookingSchema.parse(await request.json());
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
