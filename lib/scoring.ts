import type {

  Answers,

  BusinessType,

  LeakCategory,

  LeakScores,

  Question,

} from "./types";

import { LEAK_CATEGORIES, NOT_SURE_VALUE } from "./types";

import { getScoredQuestions } from "./questions";

import { resolveNumericAnswer } from "./answer-resolver";

import { higherIsWorse, lowerIsWorse } from "./questions/helpers";



function emptyScores(): LeakScores {

  return {

    acquisition: 0,

    response: 0,

    conversion: 0,

    retention: 0,

    billing: 0,

    expansion: 0,

  };

}



function getQuestionRiskScore(

  question: Question,

  answers: Answers,

  businessType: BusinessType

): number {

  const raw = answers[question.id];



  if (raw === undefined || raw === null || raw === "") {

    return 50;

  }



  if (raw === NOT_SURE_VALUE) {

    return question.notSureRiskScore ?? 50;

  }



  if (question.type === "yesno" || question.type === "select") {

    const strVal = String(raw);

    const option = question.options?.find((o) => o.value === strVal);

    return option?.riskScore ?? 50;

  }



  if (question.type === "band") {

    return 50;

  }



  if (question.type === "number" || question.type === "percent") {

    const num = resolveNumericAnswer(businessType, answers, question.id, NaN);

    if (Number.isNaN(num)) return question.notSureRiskScore ?? 50;

    if (question.scoreNumeric) {

      return Math.max(0, Math.min(100, question.scoreNumeric(num)));

    }

    return 0;

  }



  return 50;

}



function enrichDerivedScores(

  businessType: BusinessType,

  answers: Answers,

  scores: LeakScores

): void {

  if (businessType === "saas") {

    const visitors = resolveNumericAnswer(businessType, answers, "monthly_visitors", 0);

    const signups = resolveNumericAnswer(businessType, answers, "monthly_signups", 0);

    if (visitors > 0 && signups >= 0) {

      const ratio = (signups / visitors) * 100;

      const derived = Math.round(lowerIsWorse(ratio, 3, 0.8));

      scores.acquisition = Math.max(scores.acquisition, derived);

    }

  }



  if (businessType === "ecommerce") {

    const sessions = resolveNumericAnswer(businessType, answers, "monthly_sessions", 0);

    const atc = resolveNumericAnswer(businessType, answers, "add_to_cart_rate", 0);

    if (sessions > 0 && atc > 0 && scores.acquisition < 30) {

      const derived = Math.round(lowerIsWorse(atc, 10, 3));

      scores.acquisition = Math.max(scores.acquisition, derived);

    }

  }



  if (businessType === "agency") {

    const leads = resolveNumericAnswer(businessType, answers, "monthly_leads", 0);

    const discovery = resolveNumericAnswer(businessType, answers, "discovery_booking_rate", 0);

    if (leads > 0 && discovery > 0) {

      const derived = Math.round(lowerIsWorse(discovery, 40, 15) * 0.6);

      scores.acquisition = Math.max(scores.acquisition, derived);

    }

  }



  if (businessType === "service") {

    const leads = resolveNumericAnswer(businessType, answers, "monthly_leads", 0);

    const booking = resolveNumericAnswer(businessType, answers, "booking_rate", 0);

    if (leads > 0 && booking > 0) {

      const derived = Math.round(lowerIsWorse(booking, 50, 20) * 0.5);

      scores.acquisition = Math.max(scores.acquisition, derived);

    }

  }

}



export function computeLeakScores(

  businessType: BusinessType,

  answers: Answers

): LeakScores {

  const questions = getScoredQuestions(businessType);

  const totals = emptyScores();

  const weightSums = emptyScores();



  for (const question of questions) {

    if (question.type === "band") continue;

    const risk = getQuestionRiskScore(question, answers, businessType);

    if (question.categoryWeights.length === 0) continue;



    for (const { category, weight } of question.categoryWeights) {

      totals[category] += risk * weight;

      weightSums[category] += weight;

    }

  }



  const scores = emptyScores();

  for (const cat of LEAK_CATEGORIES) {

    scores[cat] =

      weightSums[cat] > 0

        ? Math.round(totals[cat] / weightSums[cat])

        : 0;

  }



  enrichDerivedScores(businessType, answers, scores);



  return scores;

}



export function getSeverityLabel(score: number): "Low" | "Medium" | "High" {

  if (score < 35) return "Low";

  if (score < 65) return "Medium";

  return "High";

}



export function rankCategoriesByScore(

  scores: LeakScores

): { category: LeakCategory; score: number }[] {

  return LEAK_CATEGORIES.map((category) => ({

    category,

    score: scores[category],

  })).sort((a, b) => b.score - a.score);

}


