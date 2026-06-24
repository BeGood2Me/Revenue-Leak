-- CreateTable
CREATE TABLE "Diagnostic" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "businessType" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "leakScores" TEXT NOT NULL,
    "estimatedLosses" TEXT NOT NULL,
    "totalEstimatedLoss" DOUBLE PRECISION NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "stripeSessionId" TEXT,
    "stripeCustomerId" TEXT,
    "email" TEXT,
    "reportEmailSentAt" TIMESTAMP(3),
    "emailCapturedAt" TIMESTAMP(3),
    "nurtureEmailSentAt" TIMESTAMP(3),

    CONSTRAINT "Diagnostic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Diagnostic_stripeSessionId_idx" ON "Diagnostic"("stripeSessionId");

-- CreateIndex
CREATE INDEX "Diagnostic_isPaid_emailCapturedAt_nurtureEmailSentAt_idx" ON "Diagnostic"("isPaid", "emailCapturedAt", "nurtureEmailSentAt");
