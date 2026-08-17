import { describe, expect, it } from "vitest";
import {
  guideSocialPreviewPath,
  SITE_LOGO_PATH,
  SITE_OG_HOME_PATH,
} from "@/lib/site-images";

describe("site image paths", () => {
  it("uses keyword-rich public paths", () => {
    expect(SITE_LOGO_PATH).toBe("/images/revenue-leak-logo.svg");
    expect(SITE_OG_HOME_PATH).toBe("/images/social/revenue-leak-diagnostic-preview");
    expect(guideSocialPreviewPath("failed-payment-recovery")).toBe(
      "/images/social/guides/failed-payment-recovery"
    );
  });
});
