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
import { runNpx } from "./lib/run.mjs";

function configureStripeEnv(envContent) {
  if (!isStripeAvailable() || !isStripeLoggedIn()) {
    return { content: envContent, stripeConfigured: false };
  }

  const { secretKey, publishableKey } = parseStripeConfig();
  if (!secretKey || !publishableKey) {
    return { content: envContent, stripeConfigured: false };
  }

  let content = envContent;
  content = upsertEnvValue(content, "STRIPE_SECRET_KEY", secretKey);
  content = upsertEnvValue(content, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", publishableKey);

  const existingPrice = getEnvValue(content, "STRIPE_PRICE_ID_DIAGNOSTIC");
  let priceId = existingPrice;

  if (isPlaceholderValue(existingPrice)) {
    console.log("Creating Stripe product and one-time $29 price…");
    const product = runStripe(["products", "create", "--name=Full Revenue Leak Report", "--description=Unlock your complete revenue leak diagnostic with top 3 fixes"]);
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
    console.log(`Using existing Stripe price: ${priceId}`);
  }

  content = upsertEnvValue(content, "STRIPE_PRICE_ID_DIAGNOSTIC", priceId);

  const existingWebhook = getEnvValue(content, "STRIPE_WEBHOOK_SECRET");
  if (isPlaceholderValue(existingWebhook)) {
    const whsec = fetchWebhookSigningSecret();
    if (whsec) {
      content = upsertEnvValue(content, "STRIPE_WEBHOOK_SECRET", whsec);
      console.log("Saved STRIPE_WEBHOOK_SECRET from Stripe CLI");
    }
  }

  return { content, stripeConfigured: true };
}

function main() {
  console.log("Revenue Leak — automated setup\n");

  if (ensureEnvLocal()) {
    console.log("Created .env.local from .env.example");
  }

  let content = readEnvFile(ENV_LOCAL);
  content = ensureBaselineEnv(content);

  const { content: withSecret, changed } = ensureAccessSecret(content);
  content = withSecret;
  if (changed) console.log("Generated DIAGNOSTIC_ACCESS_SECRET");

  const stripeResult = configureStripeEnv(content);
  content = stripeResult.content;
  writeEnvLocal(content);

  console.log("\nSyncing database…");
  runNpx(["prisma", "generate"]);
  runNpx(["prisma", "db", "push"]);

  console.log("\nSetup complete.\n");

  if (!stripeResult.stripeConfigured) {
    console.log("Stripe was skipped (CLI not installed or not logged in).");
    console.log("  1. winget install Stripe.StripeCli");
    console.log("  2. npm run stripe:login");
    console.log("  3. npm run setup   (re-run to auto-configure Stripe)\n");
  } else if (isPlaceholderValue(getEnvValue(content, "STRIPE_WEBHOOK_SECRET"))) {
    console.log("Webhook secret still needs forwarding for live events:");
    console.log("  npm run stripe:listen   (auto-saves whsec_… to .env.local)\n");
  }

  console.log("Start the app:");
  console.log("  npm run dev\n");
  console.log("Optional second terminal for Stripe webhooks:");
  console.log("  npm run stripe:listen\n");
}

try {
  main();
} catch (error) {
  console.error(error.message || error);
  process.exit(1);
}
