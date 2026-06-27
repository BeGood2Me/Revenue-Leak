import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { fulfillPaidDiagnostic } from "@/lib/fulfill-diagnostic";
import { revokePaidDiagnostic } from "@/lib/revoke-diagnostic";
import {
  getExpectedCheckoutAmountCents,
  isValidPaidCheckoutSession,
  resolveDiagnosticIdFromCharge,
} from "@/lib/stripe-fulfillment";
import { sendNurtureForDiagnostic } from "@/lib/nurture-dispatch";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const diagnosticId = session.metadata?.diagnosticId;

    if (diagnosticId) {
      const expectedAmountCents = await getExpectedCheckoutAmountCents();

      if (!isValidPaidCheckoutSession(session, diagnosticId, expectedAmountCents)) {
        console.warn(
          `Ignoring checkout.session.completed for ${diagnosticId}: payment or amount mismatch`
        );
        return NextResponse.json({ received: true });
      }

      const email =
        session.customer_details?.email ?? session.customer_email ?? null;

      await fulfillPaidDiagnostic(diagnosticId, {
        email,
        stripeSessionId: session.id,
        stripeCustomerId:
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id ?? null,
      });
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;

    try {
      const diagnosticId = await resolveDiagnosticIdFromCharge(charge);
      if (diagnosticId) {
        await revokePaidDiagnostic(diagnosticId);
      }
    } catch (error) {
      console.error("Failed to revoke access after refund:", error);
      return NextResponse.json({ error: "Refund handler failed" }, { status: 500 });
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const diagnosticId = session.metadata?.diagnosticId;
    if (diagnosticId) {
      await sendNurtureForDiagnostic(diagnosticId, { ignoreDelay: true });
    }
  }

  return NextResponse.json({ received: true });
}
