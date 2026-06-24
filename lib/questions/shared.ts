import type { Question } from "../types";
import { NOT_SURE_VALUE } from "../types";

export const NOT_SURE_OPTION = {
  value: NOT_SURE_VALUE,
  label: "Not sure",
  riskScore: 50,
};

export function withNotSure<T extends Question>(question: T): T {
  return {
    ...question,
    allowNotSure: true,
    notSureRiskScore: question.notSureRiskScore ?? 50,
  };
}
