/*
  Warnings:

  - You are about to drop the column `reportEmailSentAt` on the `Diagnostic` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Diagnostic" (
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
INSERT INTO "new_Diagnostic" ("answers", "businessType", "createdAt", "email", "estimatedLosses", "id", "isPaid", "leakScores", "stripeCustomerId", "stripeSessionId", "totalEstimatedLoss") SELECT "answers", "businessType", "createdAt", "email", "estimatedLosses", "id", "isPaid", "leakScores", "stripeCustomerId", "stripeSessionId", "totalEstimatedLoss" FROM "Diagnostic";
DROP TABLE "Diagnostic";
ALTER TABLE "new_Diagnostic" RENAME TO "Diagnostic";
CREATE INDEX "Diagnostic_stripeSessionId_idx" ON "Diagnostic"("stripeSessionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
