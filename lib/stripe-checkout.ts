import type Stripe from "stripe";
import { isPlaceholderStripeValue } from "./stripe-config";

export function getCheckoutAmountCents(): number {
  const cents = Number(process.env.STRIPE_CHECKOUT_AMOUNT_CENTS ?? 2900);
  return Number.isFinite(cents) && cents > 0 ? cents : 2900;
}

/** Expected one-time report price in cents (from Price ID or env fallback). */
export async function resolveExpectedCheckoutAmountCents(
  stripe: Stripe
): Promise<number> {
  const priceId = process.env.STRIPE_PRICE_ID_DIAGNOSTIC?.trim();

  if (priceId && !isPlaceholderStripeValue(priceId)) {
    try {
      const price = await stripe.prices.retrieve(priceId);
      if (price.active && price.unit_amount != null) {
        return price.unit_amount;
      }
    } catch (error) {
      if (!isMissingPriceError(error)) {
        throw error;
      }
    }
  }

  return getCheckoutAmountCents();
}

function buildInlinePriceLineItem(): Stripe.Checkout.SessionCreateParams.LineItem {
  return {
    price_data: {
      currency: "usd",
      product_data: {
        name: "Full Revenue Leak Report",
        description:
          "Unlock your complete revenue leak diagnostic with top 3 fixes",
      },
      unit_amount: getCheckoutAmountCents(),
    },
    quantity: 1,
  };
}

function isMissingPriceError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: string; message?: string };
  return (
    e.code === "resource_missing" ||
    Boolean(e.message?.includes("No such price"))
  );
}

/** Prefer STRIPE_PRICE_ID_DIAGNOSTIC; fall back to inline price_data if missing or wrong account. */
export async function resolveCheckoutLineItems(
  stripe: Stripe
): Promise<Stripe.Checkout.SessionCreateParams.LineItem[]> {
  const priceId = process.env.STRIPE_PRICE_ID_DIAGNOSTIC?.trim();

  if (!priceId || isPlaceholderStripeValue(priceId)) {
    return [buildInlinePriceLineItem()];
  }

  try {
    const price = await stripe.prices.retrieve(priceId);
    if (!price.active) {
      console.warn(
        `STRIPE_PRICE_ID_DIAGNOSTIC (${priceId}) is inactive — using inline price_data.`
      );
      return [buildInlinePriceLineItem()];
    }
    return [{ price: priceId, quantity: 1 }];
  } catch (error) {
    if (isMissingPriceError(error)) {
      console.warn(
        `STRIPE_PRICE_ID_DIAGNOSTIC (${priceId}) not found for this Stripe account — using inline price_data. Run npm run stripe:create-price to save a new price ID.`
      );
      return [buildInlinePriceLineItem()];
    }
    throw error;
  }
}
