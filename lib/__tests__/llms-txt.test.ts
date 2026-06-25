import { describe, it, expect } from "vitest";
import { buildLlmsTxt } from "@/lib/llms-txt";

describe("buildLlmsTxt", () => {
  it("includes site name, absolute links, and FAQ entries", () => {
    const text = buildLlmsTxt();

    expect(text.startsWith("# Revenue Leak\n")).toBe(true);
    expect(text).toContain("http://localhost:3000/");
    expect(text).toContain("http://localhost:3000/privacy");
    expect(text).toContain("How accurate is this?");
    expect(text).toContain("## Product");
  });
});
