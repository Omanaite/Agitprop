import { NextResponse } from "next/server";
import type { OrderRequest } from "@paypal/paypal-server-sdk";
import {
  CheckoutPaymentIntent,
  OrdersController,
} from "@paypal/paypal-server-sdk";
import { createPayPalClient } from "@/lib/payments/paypal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const originCheck = enforceSameOrigin(request);
    if (!originCheck.ok) {
      return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
    }
    const ip = getClientIp(request);
    const limit = rateLimit(`payments-paypal:${ip}`, 10, 60_000);
    if (!limit.allowed) {
      return NextResponse.json({ message: "Too many requests." }, { status: 429 });
    }

    const { type, tenantSlug, amount: customAmount } = (await request.json()) as {
      type: "deposit" | "design" | "custom";
      tenantSlug?: string;
      amount?: number;
    };

    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return NextResponse.json({ message: "PayPal is not configured." }, { status: 503 });
    }

    // Resolve artist's PayPal merchant email if tenantSlug provided
    let payeeMerchantEmail: string | null = null;
    if (tenantSlug) {
      const adminClient = createSupabaseServerClient();
      const { data: tenant } = await adminClient
        .from("artist_tenants")
        .select("owner_user_id")
        .eq("slug", tenantSlug)
        .eq("status", "active")
        .maybeSingle();

      if (tenant?.owner_user_id) {
        const { data: paymentSettings } = await adminClient
          .from("admin_payment_settings")
          .select("paypal_merchant_email")
          .eq("user_id", tenant.owner_user_id)
          .maybeSingle();
        payeeMerchantEmail = paymentSettings?.paypal_merchant_email ?? null;
      }
    }

    const amount =
      type === "design"
        ? Number(process.env.PRICE_DESIGN_EUR || 220)
        : type === "custom" && customAmount
        ? customAmount
        : Number(process.env.PRICE_DEPOSIT_EUR || 120);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const returnBase = tenantSlug ? `${baseUrl}/${tenantSlug}` : baseUrl;

    const orderRequest: OrderRequest = {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
          amount: {
            currencyCode: "EUR",
            value: amount.toFixed(2),
          },
          description: type === "design" ? "Custom Design" : "Session Deposit",
          // Route payment to artist's PayPal if configured
          ...(payeeMerchantEmail
            ? { payee: { emailAddress: payeeMerchantEmail } }
            : {}),
        },
      ],
      applicationContext: {
        brandName: "Agitprop",
        returnUrl: `${returnBase}?payment=success`,
        cancelUrl: `${returnBase}?payment=cancel`,
      },
    };

    const client = createPayPalClient();
    const orders = new OrdersController(client);
    const response = await orders.createOrder({
      body: orderRequest,
      prefer: "return=representation",
    });

    // Extract the approval URL so the client can redirect
    const links = (response.result as { links?: { rel: string; href: string }[] }).links ?? [];
    const approvalUrl = links.find((l) => l.rel === "approve")?.href ?? null;

    return NextResponse.json({
      id: response.result.id,
      approvalUrl,
    });
  } catch {
    return NextResponse.json({ message: "PayPal order failed." }, { status: 500 });
  }
}
