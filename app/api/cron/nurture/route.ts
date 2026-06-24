import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runDiagnostic } from "@/lib/diagnostic";
import { bandTotalLoss } from "@/lib/preview";
import { sendNurtureEmail, getNurtureDelayMs } from "@/lib/nurture-email";
import type { BusinessType } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
  }
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - getNurtureDelayMs());
  const batchLimit = Number(process.env.NURTURE_BATCH_LIMIT ?? 50);

  const candidates = await prisma.diagnostic.findMany({
    where: {
      isPaid: false,
      email: { not: null },
      emailCapturedAt: { not: null, lte: cutoff },
      nurtureEmailSentAt: null,
    },
    take: Number.isFinite(batchLimit) ? batchLimit : 50,
    orderBy: { emailCapturedAt: "asc" },
  });

  let sent = 0;
  const errors: string[] = [];

  for (const diagnostic of candidates) {
    if (!diagnostic.email) continue;

    const claimed = await prisma.diagnostic.updateMany({
      where: { id: diagnostic.id, nurtureEmailSentAt: null, isPaid: false },
      data: { nurtureEmailSentAt: new Date() },
    });

    if (claimed.count === 0) continue;

    const answers = JSON.parse(diagnostic.answers);
    const businessType = diagnostic.businessType as BusinessType;
    const result = runDiagnostic(businessType, answers);
    const lossRange = bandTotalLoss(result.totalEstimatedLoss);

    try {
      await sendNurtureEmail({
        to: diagnostic.email,
        diagnosticId: diagnostic.id,
        businessType,
        totalEstimatedLoss: diagnostic.totalEstimatedLoss,
        lossRangeLabel: lossRange.label,
      });
      sent += 1;
    } catch (error) {
      await prisma.diagnostic.update({
        where: { id: diagnostic.id },
        data: { nurtureEmailSentAt: null },
      });
      errors.push(
        `${diagnostic.id}: ${error instanceof Error ? error.message : "send failed"}`
      );
    }
  }

  return NextResponse.json({
    scanned: candidates.length,
    sent,
    errors,
  });
}
