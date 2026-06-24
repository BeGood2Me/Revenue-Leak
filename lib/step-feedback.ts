import type { Answers, BusinessType } from "./types";
import { getQuestionSteps } from "./questions";
import { getBenchmarkLine } from "./benchmarks";
import { computeLeakScores } from "./scoring";
import { computeFunnelHealthScore } from "./health-score";

export function getStepMicroFeedback(
  businessType: BusinessType,
  stepIndex: number,
  answers: Answers
): string | null {
  const steps = getQuestionSteps(businessType);
  const stepQuestions = steps[stepIndex] ?? [];
  const scored = stepQuestions.filter((q) => !q.qualitative && q.type !== "band");

  for (const q of scored) {
    const raw = answers[q.id];
    if (raw === undefined || raw === null || raw === "") continue;

    const benchLine = getBenchmarkLine(businessType, q.id, answers);
    if (
      benchLine &&
      (benchLine.includes("below benchmark") || benchLine.includes("worse than benchmark"))
    ) {
      return `${q.label}: ${benchLine}`;
    }
    if (
      benchLine &&
      (benchLine.includes("above benchmark") || benchLine.includes("better than benchmark"))
    ) {
      return `${q.label}: ${benchLine}`;
    }
  }

  if (stepIndex >= 1) {
    const scores = computeLeakScores(businessType, answers);
    const health = computeFunnelHealthScore(scores);
    const topCategory = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    if (topCategory && topCategory[1] >= 50) {
      return `So far your funnel health score is ${health}/100 — ${topCategory[0]} looks like the weakest area.`;
    }
    if (health >= 60) {
      return `Funnel health score so far: ${health}/100 — you're in reasonable shape, but there's still room to improve.`;
    }
  }

  return null;
}
