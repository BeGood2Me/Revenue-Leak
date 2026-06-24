import { prisma } from "@/lib/prisma";

/** Revoke paid report access after a refund (idempotent). */
export async function revokePaidDiagnostic(
  diagnosticId: string
): Promise<{ revoked: boolean }> {
  const result = await prisma.diagnostic.updateMany({
    where: { id: diagnosticId, isPaid: true },
    data: { isPaid: false },
  });

  return { revoked: result.count > 0 };
}
