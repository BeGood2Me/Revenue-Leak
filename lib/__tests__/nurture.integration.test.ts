import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";
import { POST, PATCH } from "@/app/api/diagnostic/route";
import { GET as nurtureGET } from "@/app/api/cron/nurture/route";
import { SAAS_LEAKY_ANSWERS, SAAS_BUSINESS_TYPE } from "@/lib/fixtures";

describe("nurture cron integration", () => {
  beforeEach(async () => {
    await prisma.diagnostic.deleteMany();
  });

  it("sends one nurture email for eligible unpaid previews", async () => {
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
    const { id, accessToken } = await createRes.json();

    const patchRes = await PATCH(
      new Request("http://localhost/api/diagnostic", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, email: "nurture@example.com", token: accessToken }),
      })
    );
    expect(patchRes.status).toBe(200);

    await prisma.diagnostic.update({
      where: { id },
      data: {
        emailCapturedAt: new Date(Date.now() - 60_000),
        checkoutStartedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
    });

    const res = await nurtureGET(new Request("http://localhost/api/cron/nurture"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.sent).toBe(1);

    const row = await prisma.diagnostic.findUnique({ where: { id } });
    expect(row?.nurtureEmailSentAt).toBeTruthy();

    const again = await nurtureGET(new Request("http://localhost/api/cron/nurture"));
    const againBody = await again.json();
    expect(againBody.sent).toBe(0);
  });
});
