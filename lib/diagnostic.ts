import type {
  Answers,
  BusinessType,
  DiagnosticResult,
} from "./types";
import { computeLeakScores } from "./scoring";
import { estimateMonthlyLosses, sumEstimatedLosses } from "./estimation";
import { buildLeakInsights, getTopLeaks } from "./insights";

export function runDiagnostic(
  businessType: BusinessType,
  answers: Answers
): DiagnosticResult {
  const leakScores = computeLeakScores(businessType, answers);
  const estimatedLosses = estimateMonthlyLosses(businessType, answers, leakScores);
  const totalEstimatedLoss = sumEstimatedLosses(estimatedLosses);
  const allLeaks = buildLeakInsights(businessType, answers, leakScores, estimatedLosses);
  const topLeaks = getTopLeaks(allLeaks, 3);

  return {
    businessType,
    leakScores,
    estimatedLosses,
    totalEstimatedLoss,
    topLeaks,
    allLeaks,
  };
}
