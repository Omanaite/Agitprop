import { NextResponse } from "next/server";
import { requireArtistOperator } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";
import { logAuditEvent } from "@/lib/audit";
import { sendTelegramMessage } from "@/lib/telegram";

async function guard(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) return { error: NextResponse.json({ message: "Invalid origin." }, { status: 403 }) };
  const ip = getClientIp(request);
  const limit = rateLimit(`studio-telegram:${ip}`, 10, 60_000);
  if (!limit.allowed) return { error: NextResponse.json({ message: "Too many requests." }, { status: 429 }) };
  const auth = await requireArtistOperator();
  if (!auth.ok || !auth.user) return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  return { user: auth.user };
}

/** GET — returns current Telegram config (token masked) */
export async function GET(request: Request) {
  const r = await guard(request);
  if ("error" in r) return r.error;
  const adminClient = createSupabaseServerClient();
  const { data } = await adminClient
    .from("artist_tenants")
    .select("telegram_bot_token,telegram_chat_id")
    .eq("owner_user_id", r.user.id)
    .maybeSingle();

  const token = data?.telegram_bot_token ?? null;
  return NextResponse.json({
    configured: !!(token && data?.telegram_chat_id),
    // Mask token: show only last 6 chars
    bot_token_hint: token ? `...${token.slice(-6)}` : null,
    chat_id: data?.telegram_chat_id ?? null,
  });
}

/** PUT — save Telegram bot token + chat ID */
export async function PUT(request: Request) {
  const r = await guard(request);
  if ("error" in r) return r.error;

  let body: { bot_token?: string; chat_id?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ message: "Invalid payload." }, { status: 400 }); }

  const botToken = (body.bot_token ?? "").trim();
  const chatId = (body.chat_id ?? "").trim();

  if (!botToken || !chatId) {
    return NextResponse.json({ message: "Both bot_token and chat_id are required." }, { status: 400 });
  }

  const adminClient = createSupabaseServerClient();
  const { error } = await adminClient
    .from("artist_tenants")
    .update({ telegram_bot_token: botToken, telegram_chat_id: chatId })
    .eq("owner_user_id", r.user.id);

  if (error) return NextResponse.json({ message: "Failed to save." }, { status: 500 });

  await logAuditEvent({ actor_email: r.user.email ?? null, action: "update", entity: "artist_tenants", entity_id: r.user.id, metadata: { telegram: true } });
  return NextResponse.json({ ok: true });
}

/** DELETE — removes Telegram config */
export async function DELETE(request: Request) {
  const r = await guard(request);
  if ("error" in r) return r.error;

  const adminClient = createSupabaseServerClient();
  await adminClient
    .from("artist_tenants")
    .update({ telegram_bot_token: null, telegram_chat_id: null })
    .eq("owner_user_id", r.user.id);

  return NextResponse.json({ ok: true });
}

/** POST — send a test message */
export async function POST(request: Request) {
  const r = await guard(request);
  if ("error" in r) return r.error;

  const adminClient = createSupabaseServerClient();
  const { data } = await adminClient
    .from("artist_tenants")
    .select("telegram_bot_token,telegram_chat_id")
    .eq("owner_user_id", r.user.id)
    .maybeSingle();

  if (!data?.telegram_bot_token || !data?.telegram_chat_id) {
    return NextResponse.json({ message: "Telegram not configured." }, { status: 400 });
  }

  try {
    await sendTelegramMessage(
      data.telegram_bot_token,
      data.telegram_chat_id,
      "✅ <b>Agitprop connected!</b>\n\nYou'll receive booking notifications here."
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Could not send test message. Check your token and chat ID." }, { status: 502 });
  }
}
