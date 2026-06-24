import { execSync } from "child_process";
import { ensureDatabaseUrl } from "./resolve-database-url.mjs";

// Prisma validates DATABASE_URL during `generate` even though it does not connect.
ensureDatabaseUrl();

execSync("npx prisma generate", { stdio: "inherit", env: process.env });

// Local dev bootstrap only — Vercel/CI have no .env.local and use managed Postgres.
if (!process.env.VERCEL && !process.env.CI) {
  execSync("node scripts/ensure-dev.mjs --postinstall", { stdio: "inherit" });
}
