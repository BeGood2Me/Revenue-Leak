import { prisma } from "@/lib/prisma";
import { runDiagnostic } from "@/lib/diagnostic";
import { bandTotalLoss } from "@/lib/preview";
import { sendNurtureEmail, getNurtureDelayMs } from "@/lib/nurture-email";
import type { BusinessType } from "@/lib/types";
import type { Diagnostic } from "@prisma/client";

export function getCheckoutAbandonDelayMs(): number {
  const hours = Number(process.env.NURTURE_CHECKOUT_ABANDON_DELAY_HOURS ?? 2);
  if (!Number.isFinite(hours) || hours < 0) return 2 * 60 * 60 * 1000;
  return hours * 60 * 60 * 1000;
}

/** When the nurture timer starts for this diagnostic. */
export function getNurtureAnchorAt(diagnostic: Pick<Diagnostic, "checkoutStartedAt" | "emailCapturedAt">): Date | null {
  if (diagnostic.checkoutStartedAt) return diagnostic.checkoutStartedAt;
  return diagnostic.emailCapturedAt;
}

export function getNurtureDelayMsForDiagnostic(
  diagnostic: Pick<Diagnostic, "checkoutStartedAt">
): number {
  if (diagnostic.checkoutStartedAt) {
    return getCheckoutAbandonDelayMs();
  }
  return getNurtureDelayMs();
}

export function isEligibleForNurture(
  diagnostic: Diagnostic,
  options?: { ignoreDelay?: boolean }
): boolean {
  if (diagnostic.isPaid || diagnostic.nurtureEmailSentAt || !diagnostic.email) {
    return false;
  }

  const anchor = getNurtureAnchorAt(diagnostic);
  if (!anchor) return false;

  if (options?.ignoreDelay) return true;

  const delayMs = getNurtureDelayMsForDiagnostic(diagnostic);
  return anchor.getTime() <= Date.now() - delayMs;
}

export async function sendNurtureForDiagnostic(
  diagnosticId: string,
  options?: { ignoreDelay?: boolean }
): Promise<"sent" | "skipped" | "failed"> {
  const diagnostic = await prisma.diagnostic.findUnique({ where: { id: diagnosticId } });
  if (!diagnostic || !isEligibleForNurture(diagnostic, options)) {
    return "skipped";
  }

  const claimed = await prisma.diagnostic.updateMany({
    where: { id: diagnosticId, nurtureEmailSentAt: null, isPaid: false },
    data: { nurtureEmailSentAt: new Date() },
  });

  if (claimed.count === 0) return "skipped";

  const answers = JSON.parse(diagnostic.answers);
  const businessType = diagnostic.businessType as BusinessType;
  const result = runDiagnostic(businessType, answers);
  const lossRange = bandTotalLoss(result.totalEstimatedLoss);

  try {
    await sendNurtureEmail({
      to: diagnostic.email!,
      diagnosticId: diagnostic.id,
      businessType,
      totalEstimatedLoss: diagnostic.totalEstimatedLoss,
      lossRangeLabel: lossRange.label,
    });
    return "sent";
  } catch {
    await prisma.diagnostic.update({
      where: { id: diagnosticId },
      data: { nurtureEmailSentAt: null },
    });
    return "failed";
  }
}

export async function processNurtureBatch(batchLimit = 50): Promise<{
  scanned: number;
  sent: number;
  errors: string[];
}> {
  const candidates = await prisma.diagnostic.findMany({
    where: {
      isPaid: false,
      email: { not: null },
      nurtureEmailSentAt: null,
      OR: [{ emailCapturedAt: { not: null } }, { checkoutStartedAt: { not: null } }],
    },
    take: batchLimit,
    orderBy: { emailCapturedAt: "asc" },
  });

  let sent = 0;
  const errors: string[] = [];

  for (const diagnostic of candidates) {
    if (!isEligibleForNurture(diagnostic)) continue;

    const result = await sendNurtureForDiagnostic(diagnostic.id);
    if (result === "sent") {
      sent += 1;
    } else if (result === "failed") {
      errors.push(`${diagnostic.id}: send failed`);
    }
  }

  return { scanned: candidates.length, sent, errors };
}
