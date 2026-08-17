import { describe, it, expect, vi } from "vitest";
import type Stripe from "stripe";
import {
  buildCheckoutSessionCreateParams,
  resolveCheckoutLineItems,
} from "@/lib/stripe-checkout";

describe("resolveCheckoutLineItems", () => {
  it("uses inline one-time price_data when price ID is missing", async () => {
    const prev = process.env.STRIPE_PRICE_ID_DIAGNOSTIC;
    delete process.env.STRIPE_PRICE_ID_DIAGNOSTIC;

    const stripe = {
      prices: { retrieve: vi.fn() },
    } as unknown as Stripe;

    const items = await resolveCheckoutLineItems(stripe);
    expect(items[0].price_data?.unit_amount).toBe(2900);
    expect(items[0].price_data?.recurring).toBeUndefined();
    expect(stripe.prices.retrieve).not.toHaveBeenCalled();

    if (prev) process.env.STRIPE_PRICE_ID_DIAGNOSTIC = prev;
  });

  it("falls back to price_data when price does not exist", async () => {
    process.env.STRIPE_PRICE_ID_DIAGNOSTIC = "price_invalid";

    const stripe = {
      prices: {
        retrieve: vi.fn().mockRejectedValue({
          code: "resource_missing",
          message: "No such price: 'price_invalid'",
        }),
      },
    } as unknown as Stripe;

    const items = await resolveCheckoutLineItems(stripe);
    expect(items[0].price_data?.product_data?.name).toBe("Full Revenue Leak Report");
    expect(items[0].price_data?.recurring).toBeUndefined();
  });

  it("falls back when configured price is recurring", async () => {
    process.env.STRIPE_PRICE_ID_DIAGNOSTIC = "price_recurring";

    const stripe = {
      prices: {
        retrieve: vi.fn().mockResolvedValue({
          id: "price_recurring",
          active: true,
          type: "recurring",
        }),
      },
    } as unknown as Stripe;

    const items = await resolveCheckoutLineItems(stripe);
    expect(items[0].price_data?.unit_amount).toBe(2900);
  });

  it("uses configured one-time price when it exists", async () => {
    process.env.STRIPE_PRICE_ID_DIAGNOSTIC = "price_valid";

    const stripe = {
      prices: {
        retrieve: vi.fn().mockResolvedValue({
          id: "price_valid",
          active: true,
          type: "one_time",
        }),
      },
    } as unknown as Stripe;

    const items = await resolveCheckoutLineItems(stripe);
    expect(items).toEqual([{ price: "price_valid", quantity: 1 }]);
  });
});

describe("buildCheckoutSessionCreateParams", () => {
  it("creates a Managed Payments one-time Checkout Session", () => {
    const params = buildCheckoutSessionCreateParams(
      "diag-1",
      [{ price: "price_valid", quantity: 1 }],
      "https://example.com/success",
      "https://example.com/cancel"
    );

    expect(params).toEqual({
      mode: "payment",
      line_items: [{ price: "price_valid", quantity: 1 }],
      managed_payments: { enabled: true },
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
      metadata: { diagnosticId: "diag-1" },
      payment_intent_data: { metadata: { diagnosticId: "diag-1" } },
    });
  });
});
