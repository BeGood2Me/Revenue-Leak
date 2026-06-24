const PLACEHOLDER =
  "postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public";

const LOCAL_FALLBACK =
  "postgresql://postgres:postgres@127.0.0.1:5432/revenue_leak_dev";

function buildUrlFromPostgresParts() {
  const host = process.env.POSTGRES_HOST?.trim();
  const database = process.env.POSTGRES_DATABASE?.trim();
  if (!host || !database) return "";

  const user = process.env.POSTGRES_USER?.trim() || "default";
  const password = process.env.POSTGRES_PASSWORD?.trim() ?? "";
  const credentials = password
    ? `${encodeURIComponent(user)}:${encodeURIComponent(password)}`
    : encodeURIComponent(user);

  return `postgresql://${credentials}@${host}/${database}?sslmode=require`;
}

/** Vercel Postgres / Neon expose several names; order matters for migrations. */
export function pickDatabaseUrlForMigrate() {
  return (
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_URL_NON_POOLING?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    process.env.NEON_DATABASE_URL?.trim() ||
    buildUrlFromPostgresParts() ||
    ""
  );
}

export function pickDatabaseUrlFromEnv() {
  return pickDatabaseUrlForMigrate();
}

export function isPlaceholderUrl(url) {
  return (
    !url ||
    url.includes("placeholder") ||
    url.includes("USER:PASSWORD") ||
    url.includes("@HOST:")
  );
}

/**
 * Ensures process.env.DATABASE_URL is set for Prisma CLI.
 * Uses a placeholder when no real URL exists so `prisma generate` can run on Vercel.
 */
export function ensureDatabaseUrl() {
  const url = pickDatabaseUrlFromEnv();

  if (url) {
    process.env.DATABASE_URL = url;
    return url;
  }

  process.env.DATABASE_URL =
    process.env.VERCEL || process.env.CI ? PLACEHOLDER : LOCAL_FALLBACK;
  return process.env.DATABASE_URL;
}

export { PLACEHOLDER, LOCAL_FALLBACK };
