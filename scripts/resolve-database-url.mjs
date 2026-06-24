const PLACEHOLDER =
  "postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public";

const LOCAL_FALLBACK =
  "postgresql://postgres:postgres@127.0.0.1:5432/revenue_leak_dev";

/** Vercel Postgres / Neon often expose these instead of DATABASE_URL. */
export function pickDatabaseUrlFromEnv() {
  return (
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    process.env.POSTGRES_URL_NON_POOLING?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.NEON_DATABASE_URL?.trim() ||
    ""
  );
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
 * Maps Vercel/Neon integration vars when DATABASE_URL is missing.
 */
export function ensureDatabaseUrl({ requiredOnVercel = false } = {}) {
  let url = pickDatabaseUrlFromEnv();

  if (url) {
    process.env.DATABASE_URL = url;
    return url;
  }

  if (process.env.VERCEL || process.env.CI) {
    if (requiredOnVercel) {
      console.error(
        [
          "Missing database connection string for build.",
          "In Vercel → Project Settings → Environment Variables, set DATABASE_URL",
          "(or connect Vercel Postgres / Neon so POSTGRES_PRISMA_URL is available)",
          "for Production and Preview, then redeploy.",
        ].join("\n")
      );
      process.exit(1);
    }

    process.env.DATABASE_URL = PLACEHOLDER;
    return PLACEHOLDER;
  }

  process.env.DATABASE_URL = LOCAL_FALLBACK;
  return LOCAL_FALLBACK;
}

export { PLACEHOLDER, LOCAL_FALLBACK };
