/** Public product name */
export const SITE_NAME = "Revenue Leak";

/** Last updated date shown on legal pages (YYYY-MM-DD). */
export const LEGAL_LAST_UPDATED = "2026-06-19";

export function getContactEmail(): string | null {
  const fromPublic = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  if (fromPublic) return fromPublic;

  const fromEmailFrom = process.env.EMAIL_FROM?.trim();
  if (!fromEmailFrom) return null;

  const match = fromEmailFrom.match(/<([^>]+)>/);
  return match?.[1] ?? fromEmailFrom;
}
