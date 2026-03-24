import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { sendNotificationEmail } from "@/lib/email/resend";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";

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
      await sendNotificationEmail({
        to: process.env.RESEND_TO_EMAIL || "studio@akemi.tattoo",
        subject: "New contact message",
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
