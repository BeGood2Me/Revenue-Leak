import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe, getAppUrl } from "@/lib/stripe";
import { createPreviewRestoreUrl, createReportUrl } from "@/lib/access-token";
import {
  getStripeConfigErrors,
  getStripeUserMessage,
} from "@/lib/stripe-config";
import { resolveCheckoutLineItems } from "@/lib/stripe-checkout";
import { verifyDiagnosticAccessToken } from "@/lib/access-token";
import { enforceRateLimit } from "@/lib/api-rate-limit";

export async function POST(request: Request) {
  try {
    const rateLimited = enforceRateLimit(request, "checkout:create");
    if (rateLimited) return rateLimited;

    const configErrors = getStripeConfigErrors();
    if (configErrors.length > 0) {
      return NextResponse.json(
        {
          error: configErrors[0],
          details: configErrors,
        },
        { status: 500 }
      );
    }

    const { diagnosticId, token } = await request.json();

    if (!diagnosticId) {
      return NextResponse.json({ error: "diagnosticId is required" }, { status: 400 });
    }

    if (
      !token ||
      typeof token !== "string" ||
      !verifyDiagnosticAccessToken(token, diagnosticId)
    ) {
      return NextResponse.json({ error: "Invalid or expired access token" }, { status: 401 });
    }

    const diagnostic = await prisma.diagnostic.findUnique({
      where: { id: diagnosticId },
    });

    if (!diagnostic) {
      return NextResponse.json({ error: "Diagnostic not found" }, { status: 404 });
    }

    if (diagnostic.isPaid) {
      return NextResponse.json(
        { error: "Diagnostic already paid", url: createReportUrl(diagnosticId) },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const appUrl = getAppUrl();
    const lineItems = await resolveCheckoutLineItems(stripe);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      // Email is collected by Stripe Checkout during payment
      success_url: `${appUrl}/result/${diagnosticId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: createPreviewRestoreUrl(diagnosticId),
      metadata: {
        diagnosticId,
      },
      payment_intent_data: {
        metadata: {
          diagnosticId,
        },
      },
    });

    await prisma.diagnostic.update({
      where: { id: diagnosticId },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session error:", error);
    return NextResponse.json(
      { error: getStripeUserMessage(error) },
      { status: 500 }
    );
  }
}
