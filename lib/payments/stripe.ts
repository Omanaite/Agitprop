import Stripe from "stripe";

// Stripe client for card payments and deposits.
export function createStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is missing.");
  }

  return new Stripe(key, {
    apiVersion: "2024-06-20",
  });
}
