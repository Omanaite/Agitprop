import { NextResponse } from "next/server";
import { OrdersController } from "@paypal/paypal-server-sdk";
import { createPayPalClient } from "@/lib/payments/paypal";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) return NextResponse.json({ message: "Invalid origin." }, { status: 403 });

  const ip = getClientIp(request);
  const limit = rateLimit(`paypal-capture:${ip}`, 10, 60_000);
  if (!limit.allowed) return NextResponse.json({ message: "Too many requests." }, { status: 429 });

  const { orderId } = (await request.json().catch(() => ({}))) as { orderId?: string };
  if (!orderId) return NextResponse.json({ message: "Missing orderId." }, { status: 400 });

  try {
    const client = createPayPalClient();
    const orders = new OrdersController(client);
    const response = await orders.captureOrder({ id: orderId });
    const status = (response.result as { status?: string }).status;
    return NextResponse.json({ ok: status === "COMPLETED", status });
  } catch {
    return NextResponse.json({ message: "Capture failed." }, { status: 500 });
  }
}
