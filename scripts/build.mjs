import { execSync } from "child_process";
import {
  ensureDatabaseUrl,
  isPlaceholderUrl,
} from "./resolve-database-url.mjs";

const databaseUrl = ensureDatabaseUrl({ requiredOnVercel: true });

execSync("npx prisma generate", { stdio: "inherit", env: process.env });

if (!isPlaceholderUrl(databaseUrl)) {
  execSync("npx prisma migrate deploy", { stdio: "inherit", env: process.env });
}

execSync("npx next build", { stdio: "inherit", env: process.env });
