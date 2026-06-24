import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  checkoutSessionEmail,
  getPaidCheckoutSessionForDiagnostic,
} from "@/lib/checkout-session";

vi.mock("@/lib/stripe", () => ({
  getStripe: vi.fn(),
}));

import { getStripe } from "@/lib/stripe";

describe("getPaidCheckoutSessionForDiagnostic", () => {
  beforeEach(() => {
    vi.mocked(getStripe).mockReset();
  });

  it("returns session when paid and diagnostic id matches", async () => {
    const session = {
      id: "cs_test",
      payment_status: "paid",
      amount_total: 2900,
      metadata: { diagnosticId: "diag-1" },
      customer_details: { email: "buyer@example.com" },
    };

    vi.mocked(getStripe).mockReturnValue({
      checkout: {
        sessions: {
          retrieve: vi.fn().mockResolvedValue(session),
        },
      },
    } as never);

    const result = await getPaidCheckoutSessionForDiagnostic("diag-1", "cs_test");
    expect(result).toEqual(session);
    expect(checkoutSessionEmail(result!)).toBe("buyer@example.com");
  });

  it("returns null when diagnostic id does not match", async () => {
    vi.mocked(getStripe).mockReturnValue({
      checkout: {
        sessions: {
          retrieve: vi.fn().mockResolvedValue({
            payment_status: "paid",
            amount_total: 2900,
            metadata: { diagnosticId: "other" },
          }),
        },
      },
    } as never);

    const result = await getPaidCheckoutSessionForDiagnostic("diag-1", "cs_test");
    expect(result).toBeNull();
  });

  it("returns null when amount does not match", async () => {
    vi.mocked(getStripe).mockReturnValue({
      checkout: {
        sessions: {
          retrieve: vi.fn().mockResolvedValue({
            payment_status: "paid",
            amount_total: 100,
            metadata: { diagnosticId: "diag-1" },
          }),
        },
      },
    } as never);

    const result = await getPaidCheckoutSessionForDiagnostic("diag-1", "cs_test");
    expect(result).toBeNull();
  });
});
