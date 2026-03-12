import { NextResponse } from "next/server";
import { createStripeClient } from "@/lib/payments/stripe";

// Ensure Node.js runtime for Stripe SDK in Vercel.
export const runtime = "nodejs";

// Creates a Stripe checkout session for deposits or design fees.
export async function POST(request: Request) {
  try {
    const { type } = (await request.json()) as { type: "deposit" | "design" };
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { message: "Stripe is not configured yet." },
        { status: 503 }
      );
    }
    const stripe = createStripeClient();

    const amount =
      type === "design"
        ? Number(process.env.PRICE_DESIGN_EUR || 220)
        : Number(process.env.PRICE_DEPOSIT_EUR || 120);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: type === "design" ? "Custom Design" : "Session Deposit",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?payment=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { message: "Stripe checkout failed." },
      { status: 500 }
    );
  }
}
