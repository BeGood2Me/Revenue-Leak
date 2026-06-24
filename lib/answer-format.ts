import type { Answers, BusinessType } from "./types";
import { NOT_SURE_VALUE } from "./types";
import { getQuestionsForBusinessType } from "./questions";

/** Human-readable label for an answer value used in insight copy */
export function formatAnswerForInsight(
  businessType: BusinessType,
  questionId: string,
  answers: Answers
): string {
  const raw = answers[questionId];
  if (raw === undefined || raw === null || raw === "") return "your current level";
  if (raw === NOT_SURE_VALUE) return "an uncertain level";

  const question = getQuestionsForBusinessType(businessType).find((q) => q.id === questionId);
  if (!question) return String(raw);

  const strVal = String(raw);

  if (question.bands) {
    const band = question.bands.find((b) => b.value === strVal);
    if (band) return band.label.toLowerCase();
  }

  if (question.options) {
    const option = question.options.find((o) => o.value === strVal);
    if (option) return option.label.toLowerCase();
  }

  if (question.type === "percent" || question.type === "number") {
    return `${raw}%`;
  }

  if (question.type === "yesno") {
    return strVal === "yes" ? "yes" : "no";
  }

  return strVal.replace(/_/g, " ");
}

export function formatPercentAnswer(
  businessType: BusinessType,
  questionId: string,
  answers: Answers,
  fallback = "your"
): string {
  const raw = answers[questionId];
  if (raw === undefined || raw === null || raw === "" || raw === NOT_SURE_VALUE) {
    return fallback;
  }
  return `${raw}%`;
}
