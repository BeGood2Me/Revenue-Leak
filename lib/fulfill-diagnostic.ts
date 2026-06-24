import { prisma } from "@/lib/prisma";
import { runDiagnostic } from "@/lib/diagnostic";
import { sendReportEmail } from "@/lib/email";
import type { BusinessType } from "@/lib/types";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

interface FulfillOptions {
  email?: string | null;
  stripeSessionId?: string | null;
  stripeCustomerId?: string | null;
}

export async function fulfillPaidDiagnostic(
  diagnosticId: string,
  options: FulfillOptions = {}
): Promise<{ fulfilled: boolean; emailSent: boolean }> {
  const diagnostic = await prisma.diagnostic.findUnique({
    where: { id: diagnosticId },
  });

  if (!diagnostic) {
    return { fulfilled: false, emailSent: false };
  }

  const email = options.email
    ? normalizeEmail(options.email)
    : diagnostic.email;

  await prisma.diagnostic.update({
    where: { id: diagnosticId },
    data: {
      isPaid: true,
      email: email ?? diagnostic.email,
      stripeSessionId: options.stripeSessionId ?? diagnostic.stripeSessionId,
      stripeCustomerId: options.stripeCustomerId ?? diagnostic.stripeCustomerId,
    },
  });

  const fresh = await prisma.diagnostic.findUnique({
    where: { id: diagnosticId },
  });

  if (!fresh?.email) {
    return { fulfilled: true, emailSent: false };
  }

  const claimed = await prisma.diagnostic.updateMany({
    where: { id: diagnosticId, reportEmailSentAt: null },
    data: { reportEmailSentAt: new Date() },
  });

  if (claimed.count === 0) {
    return { fulfilled: true, emailSent: false };
  }

  const answers = JSON.parse(fresh.answers);
  const result = runDiagnostic(fresh.businessType as BusinessType, answers);

  try {
    await sendReportEmail({
      to: fresh.email,
      diagnosticId: fresh.id,
      businessType: fresh.businessType as BusinessType,
      totalEstimatedLoss: fresh.totalEstimatedLoss,
      topLeaks: result.topLeaks,
    });
  } catch (error) {
    await prisma.diagnostic.update({
      where: { id: diagnosticId },
      data: { reportEmailSentAt: null },
    });
    throw error;
  }

  return { fulfilled: true, emailSent: true };
}
