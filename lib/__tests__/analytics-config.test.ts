import { describe, it, expect } from "vitest";
import {
  GA_MEASUREMENT_ID,
  GOOGLE_ADS_SEND_TO,
  googleAdsAccountId,
  isAnalyticsConfigured,
} from "@/lib/analytics-config";

describe("analytics-config", () => {
  it("is disabled when no env vars are set", () => {
    expect(isAnalyticsConfigured()).toBe(false);
    expect(GA_MEASUREMENT_ID).toBe("");
    expect(GOOGLE_ADS_SEND_TO).toBe("");
  });

  it("parses Google Ads account id from send_to", () => {
    expect(googleAdsAccountId("AW-123456789/AbCdEfGhIj")).toBe("AW-123456789");
  });
});
