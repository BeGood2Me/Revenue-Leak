import { existsSync } from "fs";
import {
  ENV_FILE,
  ENV_LOCAL,
  LOCAL_DATABASE_URL,
  ensureAccessSecret,
  ensureBaselineEnv,
  ensureEnvLocal,
  getEnvValue,
  isValidPostgresUrl,
  readEnvFile,
  writeEnvLocal,
  writeEnvFile,
} from "./lib/env-file.mjs";
import { runNpx } from "./lib/run.mjs";

const quiet = process.argv.includes("--quiet") || process.argv.includes("--postinstall");

function log(message) {
  if (!quiet) console.log(message);
}

function syncEnvFileDatabaseUrl(databaseUrl) {
  if (!existsSync(ENV_FILE)) {
    writeEnvFile(`DATABASE_URL="${databaseUrl}"\n`);
    return;
  }

  let content = readEnvFile(ENV_FILE);
  const existing = getEnvValue(content, "DATABASE_URL");
  if (isValidPostgresUrl(existing)) return;

  content = ensureBaselineEnv(content);
  writeEnvFile(content);
  log("Fixed invalid DATABASE_URL in .env (Prisma reads this file)");
}

function ensureDatabase(databaseUrl) {
  if (process.env.VERCEL || process.env.CI) return;

  log("Syncing local database schema…");
  try {
    runNpx(["prisma", "db", "push", "--skip-generate"], {
      // Pipe so a downed DB does not dump a full Prisma stack into predev.
      stdio: "pipe",
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
      },
    });
    log("Database schema synced.");
  } catch (error) {
    const message = error?.message || String(error);
    const firstLine =
      message
        .split("\n")
        .map((line) => line.trim())
        .find((line) => line && !line.startsWith("npm warn")) || message;
    console.warn(
      "[ensure-dev] Could not sync database schema. Start local Postgres or set a Neon/Vercel DATABASE_URL, then re-run."
    );
    console.warn(`  Example local URL: ${LOCAL_DATABASE_URL}`);
    console.warn(`  ${firstLine}`);
  }
}

function main() {
  const created = ensureEnvLocal();
  if (created) log("Created .env.local from .env.example");

  if (!existsSync(ENV_LOCAL)) {
    console.error("Missing .env.local — run: npm run setup");
    process.exit(1);
  }

  let content = readEnvFile(ENV_LOCAL);
  const beforeUrl = getEnvValue(content, "DATABASE_URL");
  content = ensureBaselineEnv(content);
  const databaseUrl = getEnvValue(content, "DATABASE_URL") || LOCAL_DATABASE_URL;

  if (!isValidPostgresUrl(beforeUrl)) {
    log(`Replaced invalid DATABASE_URL with local Postgres default`);
  }

  const { content: withSecret, changed: secretChanged } = ensureAccessSecret(content);
  content = withSecret;

  if (secretChanged) {
    log("Generated DIAGNOSTIC_ACCESS_SECRET");
  }

  writeEnvLocal(content);
  syncEnvFileDatabaseUrl(databaseUrl);

  process.env.DATABASE_URL = databaseUrl;
  ensureDatabase(databaseUrl);

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
