import type { Answers, BusinessType } from "./types";
import { NOT_SURE_VALUE } from "./types";
import { getQuestionsForBusinessType } from "./questions";

export function resolveNumericAnswer(
  businessType: BusinessType,
  answers: Answers,
  questionId: string,
  fallback = 0
): number {
  const raw = answers[questionId];
  if (raw === undefined || raw === null || raw === "") return fallback;
  if (raw === NOT_SURE_VALUE) return fallback;

  const questions = getQuestionsForBusinessType(businessType);
  const question = questions.find((q) => q.id === questionId);

  if (question?.bands) {
    const band = question.bands.find((b) => b.value === String(raw));
    if (band) return band.midpoint;
  }

  if (typeof raw === "number") return raw;
  const parsed = parseFloat(String(raw).replace(/,/g, ""));
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function resolveStringAnswer(answers: Answers, questionId: string): string {
  const raw = answers[questionId];
  return raw !== undefined ? String(raw) : "";
}
