import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { resolveExpectedCheckoutAmountCents } from "@/lib/stripe-checkout";

export async function getExpectedCheckoutAmountCents(): Promise<number> {
  const stripe = getStripe();
  return resolveExpectedCheckoutAmountCents(stripe);
}

export function isValidPaidCheckoutSession(
  session: Stripe.Checkout.Session,
  diagnosticId: string,
  expectedAmountCents: number
): boolean {
  if (session.payment_status !== "paid") return false;
  if (session.metadata?.diagnosticId !== diagnosticId) return false;
  if (session.amount_total == null) return false;
  return session.amount_total === expectedAmountCents;
}

export async function resolveDiagnosticIdFromCharge(
  charge: Stripe.Charge
): Promise<string | null> {
  if (charge.metadata?.diagnosticId) {
    return charge.metadata.diagnosticId;
  }

  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;

  if (!paymentIntentId) {
    return null;
  }

  const stripe = getStripe();
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return paymentIntent.metadata?.diagnosticId ?? null;
}
