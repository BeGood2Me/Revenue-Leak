import {
  ENV_LOCAL,
  ensureAccessSecret,
  ensureBaselineEnv,
  ensureEnvLocal,
  getEnvValue,
  isPlaceholderValue,
  readEnvFile,
  upsertEnvValue,
  writeEnvLocal,
} from "./lib/env-file.mjs";
import {
  fetchWebhookSigningSecret,
  isStripeLoggedIn,
  isStripeAvailable,
  parseStripeConfig,
  runStripe,
} from "./lib/stripe-cli.mjs";

async function main() {
  console.log("Stripe setup for Revenue Leak\n");

  if (!isStripeAvailable() || !isStripeLoggedIn()) {
    console.error("Stripe CLI is not installed or not logged in.");
    console.error("Run: npm run stripe:login\n");
    process.exit(1);
  }

  const { secretKey, publishableKey } = parseStripeConfig();
  if (!secretKey || !publishableKey) {
    console.error("Could not read test mode API keys from Stripe CLI.");
    console.error("Run: npm run stripe:login\n");
    process.exit(1);
  }

  ensureEnvLocal();
  let envContent = readEnvFile(ENV_LOCAL);
  envContent = ensureBaselineEnv(envContent);

  const existingPrice = getEnvValue(envContent, "STRIPE_PRICE_ID_DIAGNOSTIC");
  let priceId = existingPrice;

  const shouldCreatePrice =
    isPlaceholderValue(existingPrice) ||
    (existingPrice &&
      (() => {
        try {
          runStripe(["prices", "retrieve", existingPrice]);
          return false;
        } catch {
          console.log(
            `Price ${existingPrice} not found in this Stripe account — creating a new one...`
          );
          return true;
        }
      })());

  if (shouldCreatePrice) {
    console.log("Creating Stripe product and one-time $29 price...");
    const product = runStripe([
      "products",
      "create",
      "--name=Full Revenue Leak Report",
      "--description=Unlock your complete revenue leak diagnostic with top 3 fixes",
    ]);
    const price = runStripe([
      "prices",
      "create",
      `--product=${product.id}`,
      "--unit-amount=2900",
      "--currency=usd",
    ]);
    priceId = price.id;
    console.log(`Created price: ${priceId}`);
  } else {
    console.log(`Using existing price: ${priceId}`);
  }

  envContent = upsertEnvValue(envContent, "DATABASE_URL", '"file:./dev.db"');
  envContent = upsertEnvValue(envContent, "STRIPE_SECRET_KEY", secretKey);
  envContent = upsertEnvValue(envContent, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", publishableKey);
  envContent = upsertEnvValue(envContent, "STRIPE_PRICE_ID_DIAGNOSTIC", priceId);
  envContent = upsertEnvValue(envContent, "NEXT_PUBLIC_APP_URL", "http://localhost:3000");

  const { content: withSecret, changed } = ensureAccessSecret(envContent);
  envContent = withSecret;
  if (changed) console.log("Generated DIAGNOSTIC_ACCESS_SECRET");

  if (isPlaceholderValue(getEnvValue(envContent, "STRIPE_WEBHOOK_SECRET"))) {
    const whsec = fetchWebhookSigningSecret();
    if (whsec) {
      envContent = upsertEnvValue(envContent, "STRIPE_WEBHOOK_SECRET", whsec);
      console.log("Saved STRIPE_WEBHOOK_SECRET from Stripe CLI");
    }
  }

  writeEnvLocal(envContent);

  console.log("\nUpdated .env.local with your Stripe test keys and price ID.");
  console.log("Next steps:");
  console.log("1. npm run dev");
  console.log("2. Optional: npm run stripe:listen (updates webhook secret if it rotates)");
  console.log("3. Test checkout with card 4242 4242 4242 4242\n");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
