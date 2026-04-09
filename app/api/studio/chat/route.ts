import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireArtistOperator } from "@/lib/supabase/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";

export const runtime = "nodejs";

const SYSTEM = `You are a helpful assistant embedded in Agitprop Studio — a free platform for independent artists (musicians, illustrators, photographers, tattoo artists) to build their professional online presence.

You help artists with:
- Using the studio panel (galleries, posts, bookings, rates, availability, site settings)
- Understanding their storage tier (basic vs expanded)
- Setting up Telegram notifications for bookings
- Connecting a custom domain
- Managing their public artist site

Be concise, friendly, and practical. Answer in the same language the artist writes in. If you don't know something specific about their account, say so — you don't have access to their data, only general knowledge about the platform.`;

export async function POST(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) return NextResponse.json({ message: "Invalid origin." }, { status: 403 });

  const ip = getClientIp(request);
  const limit = rateLimit(`studio-chat:${ip}`, 30, 60_000);
  if (!limit.allowed) return NextResponse.json({ message: "Too many requests." }, { status: 429 });

  const auth = await requireArtistOperator();
  if (!auth.ok || !auth.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ message: "Chat not configured." }, { status: 503 });
  }

  let messages: { role: "user" | "assistant"; content: string }[];
  try {
    const body = await request.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) throw new Error();
  } catch {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }

  // Keep last 10 messages max to control token usage
  const trimmed = messages.slice(-10);

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: SYSTEM,
    messages: trimmed,
  });

  const text = response.content[0]?.type === "text" ? response.content[0].text : "";
  return NextResponse.json({ reply: text });
}
