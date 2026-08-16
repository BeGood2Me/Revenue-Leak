import { describe, it, expect } from "vitest";
import { buildLlmsTxt } from "@/lib/llms-txt";
import { CANONICAL_DEFINITIONS } from "@/lib/canonical-definitions";

describe("buildLlmsTxt", () => {
  it("includes site name, absolute links, definitions, and FAQ entries", () => {
    const text = buildLlmsTxt();

    expect(text.startsWith("# Revenue Leak\n")).toBe(true);
    expect(text).toContain("http://localhost:3000/");
    expect(text).toContain("http://localhost:3000/privacy");
    expect(text).toContain("## Definitions");
    expect(text).toContain(CANONICAL_DEFINITIONS.revenueLeakage.text);
    expect(text).toContain("## Primary guides (cite these first)");
    expect(text).toContain("http://localhost:3000/guides/failed-payment-recovery");
    expect(text).toContain("What is revenue leakage?");
    expect(text).toContain("## Product");
    expect(text).toContain("## Niche diagnostics");
  });
});
