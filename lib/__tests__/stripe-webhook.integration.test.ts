import { describe, it, expect, beforeEach, vi } from "vitest";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { POST as webhookPOST } from "@/app/api/stripe/webhook/route";
import { POST as createDiagnostic } from "@/app/api/diagnostic/route";
import { SAAS_LEAKY_ANSWERS, SAAS_BUSINESS_TYPE } from "@/lib/fixtures";
import { createReportAccessToken } from "@/lib/access-token";

vi.mock("next/headers", () => ({
  headers: () => ({
    get: (name: string) => (name === "stripe-signature" ? mockSignature : null),
  }),
}));

let mockSignature = "";

describe("stripe webhook integration", () => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  beforeEach(async () => {
    await prisma.diagnostic.deleteMany();
    mockSignature = "";
  });

  it("fulfills a paid diagnostic on checkout.session.completed", async () => {
    const createRes = await createDiagnostic(
      new Request("http://localhost/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType: SAAS_BUSINESS_TYPE,
          answers: SAAS_LEAKY_ANSWERS,
        }),
      })
    );
    const { id: diagnosticId } = await createRes.json();

    const session: Stripe.Checkout.Session = {
      id: "cs_test_webhook",
      object: "checkout.session",
      payment_status: "paid",
      amount_total: 2900,
      metadata: { diagnosticId },
      customer_details: { email: "buyer@example.com" },
    } as Stripe.Checkout.Session;

    const payload = JSON.stringify({
      id: "evt_test_1",
      object: "event",
      type: "checkout.session.completed",
      data: { object: session },
    });

    mockSignature = Stripe.webhooks.generateTestHeaderString({
      payload,
      secret: webhookSecret,
    });

    const res = await webhookPOST(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        body: payload,
      })
    );

    expect(res.status).toBe(200);

    const row = await prisma.diagnostic.findUnique({ where: { id: diagnosticId } });
    expect(row?.isPaid).toBe(true);
    expect(row?.email).toBe("buyer@example.com");

    const token = createReportAccessToken(diagnosticId);
    expect(token).toBeTruthy();
  });

  it("ignores unpaid checkout sessions", async () => {
    const createRes = await createDiagnostic(
      new Request("http://localhost/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType: SAAS_BUSINESS_TYPE,
          answers: SAAS_LEAKY_ANSWERS,
        }),
      })
    );
    const { id: diagnosticId } = await createRes.json();

    const session = {
      id: "cs_test_unpaid",
      object: "checkout.session",
      payment_status: "unpaid",
      amount_total: 2900,
      metadata: { diagnosticId },
    };

    const payload = JSON.stringify({
      id: "evt_test_2",
      object: "event",
      type: "checkout.session.completed",
      data: { object: session },
    });

    mockSignature = Stripe.webhooks.generateTestHeaderString({
      payload,
      secret: webhookSecret,
    });

    await webhookPOST(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        body: payload,
      })
    );

    const row = await prisma.diagnostic.findUnique({ where: { id: diagnosticId } });
    expect(row?.isPaid).toBe(false);
  });

  it("ignores paid sessions with the wrong amount", async () => {
    const createRes = await createDiagnostic(
      new Request("http://localhost/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType: SAAS_BUSINESS_TYPE,
          answers: SAAS_LEAKY_ANSWERS,
        }),
      })
    );
    const { id: diagnosticId } = await createRes.json();

    const session = {
      id: "cs_test_wrong_amount",
      object: "checkout.session",
      payment_status: "paid",
      amount_total: 100,
      metadata: { diagnosticId },
    };

    const payload = JSON.stringify({
      id: "evt_test_wrong_amount",
      object: "event",
      type: "checkout.session.completed",
      data: { object: session },
    });

    mockSignature = Stripe.webhooks.generateTestHeaderString({
      payload,
      secret: webhookSecret,
    });

    await webhookPOST(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        body: payload,
      })
    );

    const row = await prisma.diagnostic.findUnique({ where: { id: diagnosticId } });
    expect(row?.isPaid).toBe(false);
  });

  it("revokes access on charge.refunded", async () => {
    const createRes = await createDiagnostic(
      new Request("http://localhost/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType: SAAS_BUSINESS_TYPE,
          answers: SAAS_LEAKY_ANSWERS,
        }),
      })
    );
    const { id: diagnosticId } = await createRes.json();

    const fulfillPayload = JSON.stringify({
      id: "evt_test_fulfill",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_refund",
          object: "checkout.session",
          payment_status: "paid",
          amount_total: 2900,
          metadata: { diagnosticId },
          customer_details: { email: "refund@example.com" },
        },
      },
    });

    mockSignature = Stripe.webhooks.generateTestHeaderString({
      payload: fulfillPayload,
      secret: webhookSecret,
    });

    await webhookPOST(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        body: fulfillPayload,
      })
    );

    let row = await prisma.diagnostic.findUnique({ where: { id: diagnosticId } });
    expect(row?.isPaid).toBe(true);

    const refundPayload = JSON.stringify({
      id: "evt_test_refund",
      object: "event",
      type: "charge.refunded",
      data: {
        object: {
          id: "ch_test_refund",
          object: "charge",
          refunded: true,
          metadata: { diagnosticId },
        },
      },
    });

    mockSignature = Stripe.webhooks.generateTestHeaderString({
      payload: refundPayload,
      secret: webhookSecret,
    });

    await webhookPOST(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        body: refundPayload,
      })
    );

    row = await prisma.diagnostic.findUnique({ where: { id: diagnosticId } });
    expect(row?.isPaid).toBe(false);
  });
});
