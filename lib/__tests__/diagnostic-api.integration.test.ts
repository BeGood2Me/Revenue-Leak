import { describe, it, expect, beforeEach, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { POST, GET, PATCH, PUT } from "@/app/api/diagnostic/route";
import { SAAS_LEAKY_ANSWERS, SAAS_BUSINESS_TYPE } from "@/lib/fixtures";
import {
  createPreviewAccessToken,
  createReportAccessToken,
  verifyDiagnosticAccessToken,
} from "@/lib/access-token";

async function resetDb() {
  await prisma.diagnostic.deleteMany();
}

describe("diagnostic API integration", () => {
  beforeEach(async () => {
    await resetDb();
  });

  it("creates a diagnostic and returns preview payload", async () => {
    const res = await POST(
      new Request("http://localhost/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType: SAAS_BUSINESS_TYPE,
          answers: SAAS_LEAKY_ANSWERS,
        }),
      })
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBeTruthy();
    expect(data.topLeakCategory).toBeTruthy();
    expect(data.lossRange.label).toMatch(/\$/);
    expect(verifyDiagnosticAccessToken(data.accessToken, data.id)).toBe(true);
  });

  it("captures email via PATCH and sets emailCapturedAt", async () => {
    const createRes = await POST(
      new Request("http://localhost/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType: SAAS_BUSINESS_TYPE,
          answers: SAAS_LEAKY_ANSWERS,
        }),
      })
    );
    const created = await createRes.json();

    const patchRes = await PATCH(
      new Request("http://localhost/api/diagnostic", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: created.id,
          email: "lead@example.com",
          token: created.accessToken,
        }),
      })
    );

    expect(patchRes.status).toBe(200);
    const row = await prisma.diagnostic.findUnique({ where: { id: created.id } });
    expect(row?.email).toBe("lead@example.com");
    expect(row?.emailCapturedAt).toBeTruthy();
  });

  it("rejects PATCH without a valid token", async () => {
    const createRes = await POST(
      new Request("http://localhost/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType: SAAS_BUSINESS_TYPE,
          answers: SAAS_LEAKY_ANSWERS,
        }),
      })
    );
    const created = await createRes.json();

    const patchRes = await PATCH(
      new Request("http://localhost/api/diagnostic", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: created.id, email: "lead@example.com" }),
      })
    );
    expect(patchRes.status).toBe(401);
  });

  it("rejects PUT without a valid token", async () => {
    const createRes = await POST(
      new Request("http://localhost/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType: SAAS_BUSINESS_TYPE,
          answers: SAAS_LEAKY_ANSWERS,
        }),
      })
    );
    const created = await createRes.json();

    const putRes = await PUT(
      new Request("http://localhost/api/diagnostic", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: created.id,
          businessType: SAAS_BUSINESS_TYPE,
          answers: SAAS_LEAKY_ANSWERS,
        }),
      })
    );
    expect(putRes.status).toBe(401);
  });

  it("rejects GET without a valid token", async () => {
    const createRes = await POST(
      new Request("http://localhost/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType: SAAS_BUSINESS_TYPE,
          answers: SAAS_LEAKY_ANSWERS,
        }),
      })
    );
    const { id } = await createRes.json();

    const badRes = await GET(
      new Request(`http://localhost/api/diagnostic?id=${id}&token=invalid`)
    );
    expect(badRes.status).toBe(401);

    const token = createPreviewAccessToken(id);
    const goodRes = await GET(
      new Request(`http://localhost/api/diagnostic?id=${id}&token=${token}`)
    );
    expect(goodRes.status).toBe(200);
    const data = await goodRes.json();
    expect(data.email).toBeNull();
  });

  it("returns report fields after payment is fulfilled", async () => {
    const createRes = await POST(
      new Request("http://localhost/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType: SAAS_BUSINESS_TYPE,
          answers: SAAS_LEAKY_ANSWERS,
          email: "paid@example.com",
        }),
      })
    );
    const { id } = await createRes.json();

    const { fulfillPaidDiagnostic } = await import("@/lib/fulfill-diagnostic");
    await fulfillPaidDiagnostic(id, {
      email: "paid@example.com",
      stripeSessionId: "cs_test_mock",
    });

    const token = createReportAccessToken(id);
    const res = await GET(
      new Request(`http://localhost/api/diagnostic?id=${id}&token=${token}`)
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.isPaid).toBe(true);
    expect(data.topLeaks).toHaveLength(3);
    expect(data.reportAccessToken).toBeTruthy();
  });
});
