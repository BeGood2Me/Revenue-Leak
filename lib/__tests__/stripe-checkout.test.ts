import { describe, it, expect, vi } from "vitest";
import type Stripe from "stripe";
import { resolveCheckoutLineItems } from "@/lib/stripe-checkout";

describe("resolveCheckoutLineItems", () => {
  it("uses inline price_data when price ID is missing", async () => {
    const prev = process.env.STRIPE_PRICE_ID_DIAGNOSTIC;
    delete process.env.STRIPE_PRICE_ID_DIAGNOSTIC;

    const stripe = {
      prices: { retrieve: vi.fn() },
    } as unknown as Stripe;

    const items = await resolveCheckoutLineItems(stripe);
    expect(items[0].price_data?.unit_amount).toBe(2900);
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
  });

  it("uses configured price when it exists", async () => {
    process.env.STRIPE_PRICE_ID_DIAGNOSTIC = "price_valid";

    const stripe = {
      prices: {
        retrieve: vi.fn().mockResolvedValue({ id: "price_valid", active: true }),
      },
    } as unknown as Stripe;

    const items = await resolveCheckoutLineItems(stripe);
    expect(items).toEqual([{ price: "price_valid", quantity: 1 }]);
  });
});
