/**
 * Telegram notification helper.
 * Uses the Bot API sendMessage endpoint — no dependencies, no cost.
 *
 * Each artist configures their own bot token + chat ID in the studio.
 * Instructions: https://core.telegram.org/bots/tutorial
 */

export async function sendTelegramMessage(
  botToken: string,
  chatId: string,
  text: string
): Promise<void> {
  if (!botToken || !chatId) return;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });
  // Non-fatal — if Telegram fails, booking still works
}

export function buildBookingTelegramMessage(booking: {
  name: string;
  email: string;
  description?: string | null;
  placement?: string | null;
  preferred_date?: string | null;
}): string {
  const lines = [
    `📅 <b>New booking request</b>`,
    ``,
    `<b>Name:</b> ${booking.name}`,
    `<b>Email:</b> ${booking.email}`,
  ];
  if (booking.preferred_date) lines.push(`<b>Date:</b> ${booking.preferred_date}`);
  if (booking.placement) lines.push(`<b>Placement:</b> ${booking.placement}`);
  if (booking.description) lines.push(`\n<b>Description:</b>\n${booking.description}`);
  return lines.join("\n");
}
