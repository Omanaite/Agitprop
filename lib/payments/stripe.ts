import Stripe from "stripe";

// Stripe client for card payments and deposits.
export function createStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is missing.");
  }

  // Use the SDK default API version to avoid mismatch in build types.
  return new Stripe(key);
}
