import { execSync } from "child_process";

// Prisma validates DATABASE_URL during `generate` even though it does not connect.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    process.env.VERCEL || process.env.CI
      ? "postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public"
      : "file:./prisma/dev.db";
}

execSync("npx prisma generate", { stdio: "inherit" });

// Local dev bootstrap only — Vercel/CI have no .env.local and use managed Postgres.
if (!process.env.VERCEL && !process.env.CI) {
  execSync("node scripts/ensure-dev.mjs --postinstall", { stdio: "inherit" });
}
