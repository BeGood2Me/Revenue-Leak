/** Public product name */
export const SITE_NAME = "Revenue Leak";

/** Default meta description for the marketing site. */
export const SITE_DESCRIPTION =
  "Find the top 3 places your business is losing revenue and what to fix first. Free diagnostic in 5 minutes.";

/** Last updated date shown on legal pages (YYYY-MM-DD). */
export const LEGAL_LAST_UPDATED = "2026-06-19";

/** Canonical public site URL (no trailing slash). */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return "http://localhost:3000";
}

export function getContactEmail(): string | null {
  const fromPublic = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  if (fromPublic) return fromPublic;

  const fromEmailFrom = process.env.EMAIL_FROM?.trim();
  if (!fromEmailFrom) return null;

  const match = fromEmailFrom.match(/<([^>]+)>/);
  return match?.[1] ?? fromEmailFrom;
}
