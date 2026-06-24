import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  createPreviewAccessToken,
  createReportAccessToken,
  verifyDiagnosticAccessToken,
} from "@/lib/access-token";

describe("diagnostic access tokens", () => {
  const originalSecret = process.env.DIAGNOSTIC_ACCESS_SECRET;

  beforeEach(() => {
    process.env.DIAGNOSTIC_ACCESS_SECRET = "test-secret-key";
  });

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.DIAGNOSTIC_ACCESS_SECRET;
    } else {
      process.env.DIAGNOSTIC_ACCESS_SECRET = originalSecret;
    }
    vi.useRealTimers();
  });

  it("verifies a freshly issued preview token", () => {
    const id = "diag-123";
    const token = createPreviewAccessToken(id);
    expect(verifyDiagnosticAccessToken(token, id)).toBe(true);
  });

  it("rejects tokens for a different diagnostic id", () => {
    const token = createPreviewAccessToken("diag-a");
    expect(verifyDiagnosticAccessToken(token, "diag-b")).toBe(false);
  });

  it("rejects tampered tokens", () => {
    const token = createPreviewAccessToken("diag-123");
    expect(verifyDiagnosticAccessToken(`${token}x`, "diag-123")).toBe(false);
  });

  it("rejects expired tokens", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));

    const id = "diag-123";
    const token = createReportAccessToken(id);

    vi.setSystemTime(new Date("2027-02-01T00:00:00Z"));
    expect(verifyDiagnosticAccessToken(token, id)).toBe(false);
  });

  it("rejects preview tokens after seven days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));

    const id = "diag-123";
    const token = createPreviewAccessToken(id);

    vi.setSystemTime(new Date("2026-01-08T00:00:01Z"));
    expect(verifyDiagnosticAccessToken(token, id)).toBe(false);
  });
});
