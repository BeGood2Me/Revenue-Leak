export const COOKIE_CONSENT_KEY = "rlr_analytics_consent";

export type CookieConsentStatus = "accepted" | "declined";

export function readCookieConsent(): CookieConsentStatus | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (value === "accepted" || value === "declined") return value;
  return null;
}

export function writeCookieConsent(status: CookieConsentStatus): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(COOKIE_CONSENT_KEY, status);
}
