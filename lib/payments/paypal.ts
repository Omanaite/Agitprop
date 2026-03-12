import { Client, Environment } from "@paypal/paypal-server-sdk";

// PayPal client for wallet-based payments.
export function createPayPalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are missing.");
  }

  const environment =
    process.env.PAYPAL_ENV === "live"
      ? Environment.Production
      : Environment.Sandbox;

  return new Client({
    environment,
    clientCredentialsAuthCredentials: {
      oAuthClientId: clientId,
      oAuthClientSecret: clientSecret,
    },
  });
}
