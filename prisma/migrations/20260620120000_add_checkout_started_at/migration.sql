-- AlterTable
ALTER TABLE "Diagnostic" ADD COLUMN "checkoutStartedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Diagnostic_isPaid_checkoutStartedAt_nurtureEmailSentAt_idx" ON "Diagnostic"("isPaid", "checkoutStartedAt", "nurtureEmailSentAt");
