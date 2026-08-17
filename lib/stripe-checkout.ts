import type Stripe from "stripe";
import { isPlaceholderStripeValue } from "./stripe-config";

export type CheckoutSessionCreateParams =
  Stripe.Checkout.SessionCreateParams & {
    managed_payments?: { enabled: boolean };
  };

export function getCheckoutAmountCents(): number {
  const cents = Number(process.env.STRIPE_CHECKOUT_AMOUNT_CENTS ?? 2900);
  return Number.isFinite(cents) && cents > 0 ? cents : 2900;
}

/** Expected one-time checkout price in cents (from Price ID or env fallback). */
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

function getCheckoutCurrency(): string {
  const currency = process.env.STRIPE_CHECKOUT_CURRENCY?.trim().toLowerCase();
  return currency && /^[a-z]{3}$/.test(currency) ? currency : "usd";
}

function getCheckoutTaxCode(): string | undefined {
  const taxCode = process.env.STRIPE_CHECKOUT_TAX_CODE?.trim();
  return taxCode || undefined;
}

function buildInlinePriceLineItem(): Stripe.Checkout.SessionCreateParams.LineItem {
  const productData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.ProductData =
    {
      name: "Full Revenue Leak Report",
      description:
        "Unlock your complete revenue leak diagnostic with top 3 fixes",
    };

  const taxCode = getCheckoutTaxCode();
  if (taxCode) {
    productData.tax_code = taxCode;
  }

  return {
    price_data: {
      currency: getCheckoutCurrency(),
      product_data: productData,
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
    if (price.type !== "one_time") {
      console.warn(
        `STRIPE_PRICE_ID_DIAGNOSTIC (${priceId}) is not a one-time price — using inline price_data. Run npm run stripe:create-price.`
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

export function buildCheckoutSessionCreateParams(
  diagnosticId: string,
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  successUrl: string,
  cancelUrl: string
): CheckoutSessionCreateParams {
  return {
    mode: "payment",
    line_items: lineItems,
    managed_payments: { enabled: true },
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      diagnosticId,
    },
    payment_intent_data: {
      metadata: {
        diagnosticId,
      },
    },
  };
}
