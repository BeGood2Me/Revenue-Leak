import { describe, it, expect } from "vitest";
import {
  getCheckoutAbandonDelayMs,
  getNurtureDelayMsForDiagnostic,
  isEligibleForNurture,
} from "@/lib/nurture-dispatch";
import type { Diagnostic } from "@prisma/client";

function diagnostic(partial: Partial<Diagnostic>): Diagnostic {
  return {
    id: "test",
    createdAt: new Date(),
    businessType: "saas",
    answers: "{}",
    leakScores: "{}",
    estimatedLosses: "{}",
    totalEstimatedLoss: 1000,
    isPaid: false,
    stripeSessionId: null,
    stripeCustomerId: null,
    email: "test@example.com",
    reportEmailSentAt: null,
    emailCapturedAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
    checkoutStartedAt: null,
    nurtureEmailSentAt: null,
    ...partial,
  };
}

describe("nurture-dispatch", () => {
  it("uses shorter delay after checkout is started", () => {
    const started = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const row = diagnostic({ checkoutStartedAt: started });

    expect(getNurtureDelayMsForDiagnostic(row)).toBe(getCheckoutAbandonDelayMs());
    expect(isEligibleForNurture(row)).toBe(true);
  });

  it("waits longer when only preview email was captured", () => {
    const captured = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const row = diagnostic({ emailCapturedAt: captured, checkoutStartedAt: null });

    expect(isEligibleForNurture(row)).toBe(false);
  });
});
