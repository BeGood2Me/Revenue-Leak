import { execSync } from "child_process";
import {
  ensureDatabaseUrl,
  isPlaceholderUrl,
  pickDatabaseUrlForMigrate,
} from "./resolve-database-url.mjs";

ensureDatabaseUrl();

execSync("npx prisma generate", { stdio: "inherit", env: process.env });

const migrateUrl = pickDatabaseUrlForMigrate();
if (migrateUrl && !isPlaceholderUrl(migrateUrl)) {
  process.env.DATABASE_URL = migrateUrl;
  execSync("npx prisma migrate deploy", { stdio: "inherit", env: process.env });
} else if (process.env.VERCEL) {
  console.warn(
    "[build] Skipping prisma migrate deploy — no Postgres URL found. " +
      "Connect Vercel Postgres/Neon or set DATABASE_URL, then redeploy."
  );
}

execSync("npx next build", { stdio: "inherit", env: process.env });
