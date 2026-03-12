"use client";

import { useState } from "react";

type PaymentType = "deposit" | "design";

// Client helper to trigger Stripe or PayPal checkout flows.
export function PaymentButtons() {
  const [state, setState] = useState<string>("");

  async function startStripe(type: PaymentType) {
    setState("redirecting");
    const res = await fetch("/api/payments/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setState("Stripe unavailable.");
    }
  }

  async function startPayPal(type: PaymentType) {
    setState("creating");
    const res = await fetch("/api/payments/paypal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    const data = await res.json();
    if (data.id) {
      setState(`PayPal order created: ${data.id}`);
    } else {
      setState("PayPal unavailable.");
    }
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <button
        className="snap-transition hard-border bg-black px-4 py-3 text-white hover:bg-white hover:text-black"
        type="button"
        onClick={() => startStripe("deposit")}
      >
        Pay Deposit with Stripe
      </button>
      <button
        className="snap-transition hard-border bg-black px-4 py-3 text-white hover:bg-white hover:text-black"
        type="button"
        onClick={() => startPayPal("deposit")}
      >
        Pay Deposit with PayPal
      </button>
      <button
        className="snap-transition hard-border bg-white px-4 py-3 text-black hover:bg-black hover:text-white"
        type="button"
        onClick={() => startStripe("design")}
      >
        Pay Design with Stripe
      </button>
      <button
        className="snap-transition hard-border bg-white px-4 py-3 text-black hover:bg-black hover:text-white"
        type="button"
        onClick={() => startPayPal("design")}
      >
        Pay Design with PayPal
      </button>
      {state ? (
        <p className="text-xs uppercase tracking-[0.2em]">{state}</p>
      ) : null}
    </div>
  );
}
