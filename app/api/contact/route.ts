import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { sendNotificationEmail } from "@/lib/email/resend";

// Ensure Node.js runtime for Resend SDK in Vercel.
export const runtime = "nodejs";

// Sends a contact email using Resend if configured.
export async function POST(request: Request) {
  try {
    const payload = contactSchema.parse(await request.json());

    if (process.env.RESEND_API_KEY) {
      await sendNotificationEmail({
        to: process.env.RESEND_TO_EMAIL || "studio@akemi.tattoo",
        subject: "New contact message",
        html: `<strong>${payload.email}</strong><br/>${payload.message}`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid contact payload." },
      { status: 400 }
    );
  }
}
