import { describe, expect, it } from "vitest";
import { getCanonicalGuideForPost } from "@/lib/blog";

describe("getCanonicalGuideForPost", () => {
  it("points overlapping blog slugs at the matching guide", () => {
    expect(getCanonicalGuideForPost("failed-payment-recovery")?.slug).toBe(
      "failed-payment-recovery"
    );
    expect(getCanonicalGuideForPost("identify-profit-leaks")?.slug).toBe(
      "identify-profit-leaks"
    );
    expect(getCanonicalGuideForPost("revenue-leakage-analysis")?.slug).toBe(
      "revenue-leakage-analysis"
    );
    expect(getCanonicalGuideForPost("revenue-leakage-detection")?.slug).toBe(
      "revenue-leakage-detection"
    );
    expect(getCanonicalGuideForPost("revenue-leakage-examples")?.slug).toBe(
      "revenue-leakage-examples"
    );
  });

  it("leaves unique blog posts without a guide twin", () => {
    expect(getCanonicalGuideForPost("what-is-revenue-leakage")).toBeUndefined();
    expect(getCanonicalGuideForPost("types-of-revenue-leakage")).toBeUndefined();
  });
});
