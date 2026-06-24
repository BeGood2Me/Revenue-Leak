import { describe, it, expect } from "vitest";
import { isValidPaidCheckoutSession } from "@/lib/stripe-fulfillment";
import type Stripe from "stripe";

describe("isValidPaidCheckoutSession", () => {
  const diagnosticId = "diag-123";
  const expectedCents = 2900;

  function session(
    overrides: Partial<Stripe.Checkout.Session> = {}
  ): Stripe.Checkout.Session {
    return {
      id: "cs_test",
      object: "checkout.session",
      payment_status: "paid",
      amount_total: expectedCents,
      metadata: { diagnosticId },
      ...overrides,
    } as Stripe.Checkout.Session;
  }

  it("accepts a paid session with matching amount and metadata", () => {
    expect(
      isValidPaidCheckoutSession(session(), diagnosticId, expectedCents)
    ).toBe(true);
  });

  it("rejects unpaid sessions", () => {
    expect(
      isValidPaidCheckoutSession(
        session({ payment_status: "unpaid" }),
        diagnosticId,
        expectedCents
      )
    ).toBe(false);
  });

  it("rejects amount mismatches", () => {
    expect(
      isValidPaidCheckoutSession(
        session({ amount_total: 100 }),
        diagnosticId,
        expectedCents
      )
    ).toBe(false);
  });

  it("rejects diagnostic id mismatches", () => {
    expect(
      isValidPaidCheckoutSession(
        session({ metadata: { diagnosticId: "other" } }),
        diagnosticId,
        expectedCents
      )
    ).toBe(false);
  });
});
