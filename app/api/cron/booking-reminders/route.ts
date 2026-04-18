import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendNotificationEmail } from "@/lib/email/resend";

export const runtime = "nodejs";

/**
 * Cron: booking-reminders
 * Schedule: 0 8 * * * (08:00 UTC daily) — configurado en vercel.json
 *
 * Envía recordatorio por email al cliente 24h antes de su cita confirmada.
 * Solo se dispara desde Vercel Cron (CRON_SECRET requerido en producción).
 * Requiere: RESEND_API_KEY, CRON_SECRET en env vars.
 */
export async function GET(request: Request) {
  // Verificar que la llamada viene de Vercel Cron
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ message: "RESEND_API_KEY not configured" }, { status: 503 });
  }

  const client = createSupabaseServerClient();

  // Busca bookings confirmados con preferred_date = mañana (UTC)
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD

  const { data: bookings, error } = await client
    .from("bookings")
    .select("id, name, email, preferred_date, placement, slot_label")
    .eq("status", "confirmed")
    .eq("preferred_date", tomorrowStr);

  if (error) {
    console.error("[cron/booking-reminders] DB error:", error.message);
    return NextResponse.json({ message: "DB error" }, { status: 500 });
  }

  if (!bookings || bookings.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  let sent = 0;
  let failed = 0;

  for (const booking of bookings) {
    try {
      const slotInfo = booking.slot_label
        ? `<p><strong>Time slot:</strong> ${booking.slot_label}</p>`
        : "";

      await sendNotificationEmail({
        to: booking.email,
        subject: `Reminder: your session is tomorrow — ${booking.preferred_date}`,
        html: `
          <p>Hi ${booking.name},</p>
          <p>This is a friendly reminder that your session is confirmed for <strong>tomorrow, ${booking.preferred_date}</strong>.</p>
          ${slotInfo}
          <table cellpadding="6" style="font-family:monospace;font-size:14px;margin:16px 0">
            <tr><td><strong>Placement</strong></td><td>${booking.placement}</td></tr>
          </table>
          <p>If you need to reschedule or have any questions, please reply to this email or contact the studio directly.</p>
          <p>See you tomorrow!</p>
        `,
      });
      sent++;
    } catch (e) {
      console.error(`[cron/booking-reminders] Failed for booking ${booking.id}:`, e);
      failed++;
    }
  }

  return NextResponse.json({ ok: true, sent, failed });
}
