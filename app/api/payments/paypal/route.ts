import { NextResponse } from "next/server";
import type { OrderRequest } from "@paypal/paypal-server-sdk";
import {
  CheckoutPaymentIntent,
  OrdersController,
} from "@paypal/paypal-server-sdk";
import { createPayPalClient } from "@/lib/payments/paypal";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";

// Ensure Node.js runtime for PayPal SDK in Vercel.
export const runtime = "nodejs";

// Creates a PayPal order for deposits or design fees.
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
    const limit = rateLimit(`payments-paypal:${ip}`, 10, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { message: "Too many requests. Try again later." },
        { status: 429 }
      );
    }
    const { type } = (await request.json()) as { type: "deposit" | "design" };
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return NextResponse.json(
        { message: "PayPal is not configured yet." },
        { status: 503 }
      );
    }
    const client = createPayPalClient();
    const orders = new OrdersController(client);

    const amount =
      type === "design"
        ? Number(process.env.PRICE_DESIGN_EUR || 220)
        : Number(process.env.PRICE_DEPOSIT_EUR || 120);

    const orderRequest: OrderRequest = {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
          amount: {
            currencyCode: "EUR",
            value: amount.toFixed(2),
          },
          description:
            type === "design" ? "Custom Design" : "Session Deposit",
        },
      ],
      applicationContext: {
        brandName: "Akemi Tattoo",
        returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/?payment=success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/?payment=cancel`,
      },
    };

    const response = await orders.createOrder({
      body: orderRequest,
      prefer: "return=representation",
    });

    return NextResponse.json({ id: response.result.id });
  } catch {
    return NextResponse.json(
      { message: "PayPal order failed." },
      { status: 500 }
    );
  }
}
