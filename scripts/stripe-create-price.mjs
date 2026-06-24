/**
 * Creates a Stripe product + one-time price using STRIPE_SECRET_KEY from .env.local
 * and saves STRIPE_PRICE_ID_DIAGNOSTIC. Use when the price ID is from another account.
 */
import Stripe from "stripe";
import {
  ENV_LOCAL,
  ensureEnvLocal,
  getEnvValue,
  readEnvFile,
  upsertEnvValue,
  writeEnvLocal,
} from "./lib/env-file.mjs";

const amountCents = Number(process.env.STRIPE_CHECKOUT_AMOUNT_CENTS ?? 2900);

async function main() {
  ensureEnvLocal();
  const content = readEnvFile(ENV_LOCAL);
  const secretKey = getEnvValue(content, "STRIPE_SECRET_KEY");

  if (!secretKey || secretKey.includes("...")) {
    console.error("Set STRIPE_SECRET_KEY in .env.local first.");
    process.exit(1);
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2025-02-24.acacia",
  });

  console.log("Creating product and one-time price in your Stripe account...\n");

  const product = await stripe.products.create({
    name: "Full Revenue Leak Report",
    description:
      "Unlock your complete revenue leak diagnostic with top 3 fixes",
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: amountCents,
    currency: "usd",
  });

  const updated = upsertEnvValue(content, "STRIPE_PRICE_ID_DIAGNOSTIC", price.id);
  writeEnvLocal(updated);

  console.log(`Product: ${product.id}`);
  console.log(`Price:   ${price.id} ($${(amountCents / 100).toFixed(2)} USD)`);
  console.log("\nUpdated .env.local — restart npm run dev and try checkout again.\n");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
