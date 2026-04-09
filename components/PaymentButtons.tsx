"use client";

import { useState } from "react";

type PaymentType = "deposit" | "design";

type PaymentButtonsProps = {
  tenantSlug?: string;
  copy: {
    paymentStateStripeUnavailable: string;
    paymentStatePaypalUnavailable: string;
    paymentStateRedirecting: string;
    paymentStateCreating: string;
    payDepositStripe: string;
    payDepositPaypal: string;
    payDesignStripe: string;
    payDesignPaypal: string;
  };
};

export function PaymentButtons({ copy, tenantSlug }: PaymentButtonsProps) {
  const [state, setState] = useState<string>("");

  async function startStripe(type: PaymentType) {
    setState(copy.paymentStateRedirecting);
    const res = await fetch("/api/payments/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, tenantSlug }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setState(copy.paymentStateStripeUnavailable);
    }
  }

  async function startPayPal(type: PaymentType) {
    setState(copy.paymentStateCreating);
    const res = await fetch("/api/payments/paypal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, tenantSlug }),
    });
    const data = await res.json();
    if (data.approvalUrl) {
      window.location.href = data.approvalUrl;
    } else {
      setState(copy.paymentStatePaypalUnavailable);
    }
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <button
        className="snap-transition theme-border theme-invert px-4 py-3"
        type="button"
        onClick={() => startStripe("deposit")}
      >
        {copy.payDepositStripe}
      </button>
      <button
        className="snap-transition theme-border theme-invert px-4 py-3"
        type="button"
        onClick={() => startPayPal("deposit")}
      >
        {copy.payDepositPaypal}
      </button>
      <button
        className="snap-transition theme-border theme-hover-invert px-4 py-3"
        type="button"
        onClick={() => startStripe("design")}
      >
        {copy.payDesignStripe}
      </button>
      <button
        className="snap-transition theme-border theme-hover-invert px-4 py-3"
        type="button"
        onClick={() => startPayPal("design")}
      >
        {copy.payDesignPaypal}
      </button>
      {state && (
        <p className="md:col-span-2 text-xs uppercase tracking-[0.2em] opacity-70">
          {state}
        </p>
      )}
    </div>
  );
}
