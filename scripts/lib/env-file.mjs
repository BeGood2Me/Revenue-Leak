import { randomBytes } from "crypto";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

export const ROOT = process.cwd();
export const ENV_LOCAL = join(ROOT, ".env.local");
export const ENV_FILE = join(ROOT, ".env");
export const ENV_EXAMPLE = join(ROOT, ".env.example");

/** Local Postgres default used when DATABASE_URL is missing or invalid (e.g. leftover SQLite file: URLs). */
export const LOCAL_DATABASE_URL =
  "postgresql://postgres:postgres@127.0.0.1:5432/revenue_leak_dev";

export function isValidPostgresUrl(value) {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  return v.startsWith("postgresql://") || v.startsWith("postgres://");
}

export function readEnvFile(path) {
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf8");
}

export function upsertEnvValue(content, key, value) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");

  if (pattern.test(content)) {
    return content.replace(pattern, line);
  }

  const trimmed = content.trim();
  return trimmed ? `${trimmed}\n${line}\n` : `${line}\n`;
}

export function getEnvValue(content, key) {
  const match = content.match(new RegExp(`^${key}=(.*)$`, "m"));
  if (!match) return "";
  return match[1].trim().replace(/^["']|["']$/g, "");
}

export function isPlaceholderValue(value) {
  if (!value) return true;
  const v = value.trim().toLowerCase();
  return (
    v.includes("change-me") ||
    v.includes("placeholder") ||
    v.includes("your_") ||
    v.endsWith("...") ||
    v === "whsec_replace_after_stripe_listen" ||
    v === "dev-insecure-diagnostic-secret-change-me"
  );
}

export function ensureEnvLocal() {
  if (!existsSync(ENV_LOCAL) && existsSync(ENV_EXAMPLE)) {
    writeFileSync(ENV_LOCAL, readFileSync(ENV_EXAMPLE, "utf8"));
    return true;
  }
  return false;
}

export function ensureBaselineEnv(content) {
  let next = content;
  const databaseUrl = getEnvValue(next, "DATABASE_URL");
  if (!isValidPostgresUrl(databaseUrl)) {
    next = upsertEnvValue(next, "DATABASE_URL", `"${LOCAL_DATABASE_URL}"`);
  }
  if (!getEnvValue(next, "NEXT_PUBLIC_APP_URL")) {
    next = upsertEnvValue(next, "NEXT_PUBLIC_APP_URL", "http://localhost:3000");
  }
  return next;
}

export function ensureAccessSecret(content) {
  const existing = getEnvValue(content, "DIAGNOSTIC_ACCESS_SECRET");
  if (!isPlaceholderValue(existing)) {
    return { content, changed: false };
  }

  const secret = randomBytes(32).toString("base64url");
  return {
    content: upsertEnvValue(content, "DIAGNOSTIC_ACCESS_SECRET", secret),
    changed: true,
  };
}

export function saveWebhookSecret(secret) {
  if (!secret?.startsWith("whsec_")) return false;

  ensureEnvLocal();
  let content = readEnvFile(ENV_LOCAL);
  const existing = getEnvValue(content, "STRIPE_WEBHOOK_SECRET");
  if (existing === secret) return false;

  content = upsertEnvValue(content, "STRIPE_WEBHOOK_SECRET", secret);
  writeFileSync(ENV_LOCAL, content);
  return true;
}

export function writeEnvLocal(content) {
  writeFileSync(ENV_LOCAL, content);
}

export function writeEnvFile(content) {
  writeFileSync(ENV_FILE, content);
}
