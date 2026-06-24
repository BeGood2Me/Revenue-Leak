import { existsSync } from "fs";
import { join } from "path";
import { spawnSyncExecutable } from "./run.mjs";

export function resolveStripeExecutable() {
  if (process.platform === "win32") {
    const winGetStripe = join(
      process.env.LOCALAPPDATA ?? "",
      "Microsoft",
      "WinGet",
      "Packages",
      "Stripe.StripeCli_Microsoft.Winget.Source_8wekyb3d8bbwe",
      "stripe.exe"
    );
    if (existsSync(winGetStripe)) return winGetStripe;
    return "stripe.cmd";
  }
  return "stripe";
}

export function runStripe(args, { allowFailure = false } = {}) {
  const stripe = resolveStripeExecutable();
  const result = spawnSyncExecutable(stripe, args, {
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.error) {
    if (allowFailure) return null;
    throw result.error;
  }

  if (result.status !== 0) {
    if (allowFailure) return null;
    throw new Error(result.stderr || result.stdout || `stripe ${args.join(" ")} failed`);
  }

  const output = `${result.stdout || ""}${result.stderr || ""}`.trim();
  if (!output) return null;

  try {
    return JSON.parse(output);
  } catch {
    return output;
  }
}

export function isStripeAvailable() {
  return runStripe(["version"], { allowFailure: true }) !== null;
}

export function isStripeLoggedIn() {
  return runStripe(["config", "--list"], { allowFailure: true }) !== null;
}

export function parseStripeConfig() {
  const config = runStripe(["config", "--list"], { allowFailure: true });
  if (!config || typeof config !== "object") return {};

  const defaults = config.default ?? config;
  return {
    secretKey: defaults.test_mode_api_key,
    publishableKey: defaults.test_mode_pub_key,
  };
}

export function fetchWebhookSigningSecret() {
  const output = runStripe(["listen", "--print-secret"], { allowFailure: true });
  if (!output) return null;

  const text = typeof output === "string" ? output : JSON.stringify(output);
  const match = text.match(/whsec_[a-zA-Z0-9]+/);
  return match?.[0] ?? null;
}
