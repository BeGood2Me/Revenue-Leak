import { spawnExecutable } from "./lib/run.mjs";
import { resolveStripeExecutable } from "./lib/stripe-cli.mjs";
import { saveWebhookSecret } from "./lib/env-file.mjs";

const stripe = resolveStripeExecutable();
const args = ["listen", "--forward-to", "localhost:3000/api/stripe/webhook"];

console.log(`Starting: ${stripe} ${args.join(" ")}\n`);

let webhookSaved = false;

function captureWebhookSecret(chunk) {
  const match = chunk.toString().match(/whsec_[a-zA-Z0-9]+/);
  if (!match || webhookSaved) return;

  if (saveWebhookSecret(match[0])) {
    webhookSaved = true;
    console.log("\nSaved STRIPE_WEBHOOK_SECRET to .env.local — restart npm run dev if it is running.\n");
  }
}

const child = spawnExecutable(stripe, args);

child.stdout?.on("data", (chunk) => {
  process.stdout.write(chunk);
  captureWebhookSecret(chunk);
});

child.stderr?.on("data", (chunk) => {
  process.stderr.write(chunk);
  captureWebhookSecret(chunk);
});

child.on("error", (err) => {
  console.error("\nCould not run Stripe CLI.");
  console.error(err.message);
  console.error("\nInstall it with: winget install Stripe.StripeCli");
  console.error("Then open a new terminal, or run: npm run stripe:listen\n");
  process.exit(1);
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
