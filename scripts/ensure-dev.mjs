import { existsSync } from "fs";
import { join } from "path";
import {
  ENV_LOCAL,
  ensureAccessSecret,
  ensureBaselineEnv,
  ensureEnvLocal,
  readEnvFile,
  writeEnvLocal,
} from "./lib/env-file.mjs";
import { runNpx } from "./lib/run.mjs";

const quiet = process.argv.includes("--quiet") || process.argv.includes("--postinstall");

function log(message) {
  if (!quiet) console.log(message);
}

function ensureDatabase() {
  const dbPath = join(process.cwd(), "prisma", "dev.db");
  if (existsSync(dbPath)) return;

  log("Creating local SQLite database…");
  runNpx(["prisma", "db", "push", "--skip-generate"], {
    stdio: quiet ? "pipe" : "inherit",
  });
}

function main() {
  const created = ensureEnvLocal();
  if (created) log("Created .env.local from .env.example");

  if (!existsSync(ENV_LOCAL)) {
    console.error("Missing .env.local — run: npm run setup");
    process.exit(1);
  }

  let content = readEnvFile(ENV_LOCAL);
  content = ensureBaselineEnv(content);

  const { content: withSecret, changed: secretChanged } = ensureAccessSecret(content);
  content = withSecret;

  if (secretChanged) {
    log("Generated DIAGNOSTIC_ACCESS_SECRET");
  }

  writeEnvLocal(content);
  ensureDatabase();

  if (!quiet) {
    log("Dev environment ready.");
  }
}

try {
  main();
} catch (error) {
  console.error(error.message || error);
  process.exit(1);
}
