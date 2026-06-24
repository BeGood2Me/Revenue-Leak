/** Google Analytics 4 measurement ID (e.g. G-XXXXXXXX). */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

/** Google Ads conversion send_to (e.g. AW-123456789/AbCdEfGhIj). Optional. */
export const GOOGLE_ADS_SEND_TO =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_SEND_TO?.trim() ?? "";

/** Meta (Facebook) Pixel ID (numeric). Optional. */
export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? "";

export function isAnalyticsConfigured(): boolean {
  return Boolean(GA_MEASUREMENT_ID || GOOGLE_ADS_SEND_TO || META_PIXEL_ID);
}

export function googleAdsAccountId(sendTo: string): string {
  return sendTo.split("/")[0] ?? sendTo;
}
