import { prisma } from "@/lib/prisma";
import { runDiagnostic } from "@/lib/diagnostic";
import { bandTotalLoss } from "@/lib/preview";
import {
  sendNurtureEmail,
  sendNurtureFollowupEmail,
  getNurtureDelayMs,
  getNurtureFollowupDelayMs,
} from "@/lib/nurture-email";
import { LEAK_CATEGORY_LABELS } from "@/lib/types";
import type { BusinessType, LeakCategory } from "@/lib/types";
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

export function isEligibleForNurtureFollowup(
  diagnostic: Diagnostic,
  options?: { ignoreDelay?: boolean }
): boolean {
  if (
    diagnostic.isPaid ||
    !diagnostic.email ||
    !diagnostic.nurtureEmailSentAt ||
    diagnostic.nurtureFollowupSentAt
  ) {
    return false;
  }

  const captured = diagnostic.emailCapturedAt;
  if (!captured) return false;
  if (options?.ignoreDelay) return true;

  return captured.getTime() <= Date.now() - getNurtureFollowupDelayMs();
}

function previewParams(diagnostic: Diagnostic) {
  const answers = JSON.parse(diagnostic.answers);
  const businessType = diagnostic.businessType as BusinessType;
  const result = runDiagnostic(businessType, answers);
  const lossRange = bandTotalLoss(result.totalEstimatedLoss);
  const topLeak = result.topLeaks[0];

  return {
    to: diagnostic.email!,
    diagnosticId: diagnostic.id,
    businessType,
    totalEstimatedLoss: diagnostic.totalEstimatedLoss,
    lossRangeLabel: lossRange.label,
    topLeakLabel: topLeak
      ? LEAK_CATEGORY_LABELS[topLeak.category as LeakCategory]
      : null,
  };
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

  try {
    await sendNurtureEmail(previewParams(diagnostic));
    return "sent";
  } catch {
    await prisma.diagnostic.update({
      where: { id: diagnosticId },
      data: { nurtureEmailSentAt: null },
    });
    return "failed";
  }
}

export async function sendNurtureFollowupForDiagnostic(
  diagnosticId: string,
  options?: { ignoreDelay?: boolean }
): Promise<"sent" | "skipped" | "failed"> {
  const diagnostic = await prisma.diagnostic.findUnique({ where: { id: diagnosticId } });
  if (!diagnostic || !isEligibleForNurtureFollowup(diagnostic, options)) {
    return "skipped";
  }

  const claimed = await prisma.diagnostic.updateMany({
    where: {
      id: diagnosticId,
      nurtureFollowupSentAt: null,
      isPaid: false,
      nurtureEmailSentAt: { not: null },
    },
    data: { nurtureFollowupSentAt: new Date() },
  });

  if (claimed.count === 0) return "skipped";

  try {
    await sendNurtureFollowupEmail(previewParams(diagnostic));
    return "sent";
  } catch {
    await prisma.diagnostic.update({
      where: { id: diagnosticId },
      data: { nurtureFollowupSentAt: null },
    });
    return "failed";
  }
}

export async function processNurtureBatch(batchLimit = 50): Promise<{
  scanned: number;
  sent: number;
  errors: string[];
}> {
  const firstPass = await prisma.diagnostic.findMany({
    where: {
      isPaid: false,
      email: { not: null },
      nurtureEmailSentAt: null,
      OR: [{ emailCapturedAt: { not: null } }, { checkoutStartedAt: { not: null } }],
    },
    take: batchLimit,
    orderBy: { emailCapturedAt: "asc" },
  });

  const followupPass = await prisma.diagnostic.findMany({
    where: {
      isPaid: false,
      email: { not: null },
      nurtureEmailSentAt: { not: null },
      nurtureFollowupSentAt: null,
      emailCapturedAt: { not: null },
    },
    take: batchLimit,
    orderBy: { emailCapturedAt: "asc" },
  });

  let sent = 0;
  const errors: string[] = [];

  for (const diagnostic of firstPass) {
    if (!isEligibleForNurture(diagnostic)) continue;

    const result = await sendNurtureForDiagnostic(diagnostic.id);
    if (result === "sent") {
      sent += 1;
    } else if (result === "failed") {
      errors.push(`${diagnostic.id}: send failed`);
    }
  }

  for (const diagnostic of followupPass) {
    if (!isEligibleForNurtureFollowup(diagnostic)) continue;

    const result = await sendNurtureFollowupForDiagnostic(diagnostic.id);
    if (result === "sent") {
      sent += 1;
    } else if (result === "failed") {
      errors.push(`${diagnostic.id}: follow-up send failed`);
    }
  }

  return {
    scanned: firstPass.length + followupPass.length,
    sent,
    errors,
  };
}
