import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import {
  getExpectedCheckoutAmountCents,
  isValidPaidCheckoutSession,
} from "@/lib/stripe-fulfillment";

export async function getPaidCheckoutSessionForDiagnostic(
  diagnosticId: string,
  sessionId: string
): Promise<Stripe.Checkout.Session | null> {
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const expectedAmountCents = await getExpectedCheckoutAmountCents();

    if (isValidPaidCheckoutSession(session, diagnosticId, expectedAmountCents)) {
      return session;
    }
  } catch (error) {
    console.error("Failed to retrieve checkout session:", error);
  }

  return null;
}

export function checkoutSessionEmail(
  session: Stripe.Checkout.Session
): string | null {
  return (
    session.customer_details?.email ?? session.customer_email ?? null
  );
}
