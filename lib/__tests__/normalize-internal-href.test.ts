import { describe, expect, it } from "vitest";
import {
  collapseDuplicateBlogPrefix,
  normalizeInternalHref,
} from "@/lib/normalize-internal-href";

describe("normalizeInternalHref", () => {
  it("prefixes relative blog paths", () => {
    expect(normalizeInternalHref("blog/types-of-revenue-leakage")).toBe(
      "/blog/types-of-revenue-leakage"
    );
  });

  it("collapses duplicate blog prefixes", () => {
    expect(normalizeInternalHref("/blog/blog/types-of-revenue-leakage")).toBe(
      "/blog/types-of-revenue-leakage"
    );
  });
});

describe("collapseDuplicateBlogPrefix", () => {
  it("fixes repeated /blog segments", () => {
    expect(collapseDuplicateBlogPrefix("/blog/blog/types-of-revenue-leakage")).toBe(
      "/blog/types-of-revenue-leakage"
    );
    expect(collapseDuplicateBlogPrefix("/blog/blog/blog/foo")).toBe("/blog/foo");
    expect(collapseDuplicateBlogPrefix("/blog/types-of-revenue-leakage")).toBe(
      "/blog/types-of-revenue-leakage"
    );
  });
});
