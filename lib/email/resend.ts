import { Resend } from "resend";

// Resend client for transactional email notifications.
export function createResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  return new Resend(apiKey);
}

// Helper to send a booking or contact notification.
export async function sendNotificationEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const client = createResendClient();
  const from = process.env.RESEND_FROM_EMAIL || "studio@akemi.tattoo";

  await client.emails.send({
    from,
    to,
    subject,
    html,
  });
}
