-- CreateTable
CREATE TABLE "Diagnostic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "businessType" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "leakScores" TEXT NOT NULL,
    "estimatedLosses" TEXT NOT NULL,
    "totalEstimatedLoss" REAL NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "stripeSessionId" TEXT,
    "stripeCustomerId" TEXT,
    "email" TEXT
);

-- CreateIndex
CREATE INDEX "Diagnostic_stripeSessionId_idx" ON "Diagnostic"("stripeSessionId");
