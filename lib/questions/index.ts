import type { BusinessType, Question } from "../types";
import { saasQuestions } from "./saas";
import { ecommerceQuestions } from "./ecommerce";
import { agencyQuestions } from "./agency";
import { serviceQuestions } from "./service";

const QUESTIONS_BY_TYPE: Record<BusinessType, Question[]> = {
  saas: saasQuestions,
  ecommerce: ecommerceQuestions,
  agency: agencyQuestions,
  service: serviceQuestions,
};

export function getQuestionsForBusinessType(type: BusinessType): Question[] {
  return QUESTIONS_BY_TYPE[type];
}

/** Split questions into wizard steps (3 questions per step) */
export function getQuestionSteps(type: BusinessType): Question[][] {
  const questions = getQuestionsForBusinessType(type);
  const stepSize = 3;
  const steps: Question[][] = [];
  for (let i = 0; i < questions.length; i += stepSize) {
    steps.push(questions.slice(i, i + stepSize));
  }
  return steps;
}

export function getScoredQuestions(type: BusinessType): Question[] {
  return getQuestionsForBusinessType(type).filter((q) => !q.qualitative);
}
