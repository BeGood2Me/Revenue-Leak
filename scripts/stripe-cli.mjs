import { spawnExecutable } from "./lib/run.mjs";
import { resolveStripeExecutable } from "./lib/stripe-cli.mjs";

const stripe = resolveStripeExecutable();
const args = process.argv.slice(2);

const child = spawnExecutable(stripe, args.length ? args : ["login"], {
  stdio: "inherit",
});

child.on("error", (err) => {
  console.error("\nCould not run Stripe CLI.");
  console.error(err.message);
  console.error("\nInstall it with: winget install Stripe.StripeCli\n");
  process.exit(1);
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
