export type BusinessType = "saas" | "ecommerce" | "agency" | "service";

export type LeakCategory =
  | "acquisition"
  | "response"
  | "conversion"
  | "retention"
  | "billing"
  | "expansion";

export const LEAK_CATEGORIES: LeakCategory[] = [
  "acquisition",
  "response",
  "conversion",
  "retention",
  "billing",
  "expansion",
];

export const LEAK_CATEGORY_LABELS: Record<LeakCategory, string> = {
  acquisition: "Acquisition leak",
  response: "Response leak",
  conversion: "Conversion leak",
  retention: "Retention leak",
  billing: "Billing / recovery leak",
  expansion: "Expansion leak",
};

export const LEAK_CATEGORY_DESCRIPTIONS: Record<LeakCategory, string> = {
  acquisition:
    "Revenue lost when traffic and awareness never turn into qualified leads or signups.",
  response:
    "Revenue lost from slow replies, missed calls, or inquiries that go unanswered.",
  conversion:
    "Revenue lost when interested prospects don't complete a purchase, booking, or contract.",
  retention:
    "Revenue lost when customers churn early or don't buy again.",
  billing:
    "Revenue lost from failed payments, billing errors, or under-billing.",
  expansion:
    "Revenue lost from missing upsell, cross-sell, or account expansion opportunities.",
};

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  saas: "SaaS",
  ecommerce: "Ecommerce",
  agency: "Agency",
  service: "Service business",
};

export const BUSINESS_TYPE_DESCRIPTIONS: Record<BusinessType, string> = {
  saas: "B2B or B2C software with trials, subscriptions, and recurring revenue.",
  ecommerce: "Online stores and DTC brands selling physical or digital products.",
  agency: "Marketing, consulting, creative, or professional service agencies.",
  service: "Local or appointment-based businesses like clinics, trades, and salons.",
};

export type QuestionType = "number" | "percent" | "yesno" | "select" | "band";

export const NOT_SURE_VALUE = "not_sure";

export interface CategoryWeight {
  category: LeakCategory;
  weight: number;
}

export interface QuestionOption {
  value: string;
  label: string;
  /** 0 = healthy, 100 = severe leak */
  riskScore: number;
}

export interface QuestionBand {
  value: string;
  label: string;
  /** Midpoint used in revenue estimation formulas */
  midpoint: number;
}

export interface Question {
  id: string;
  label: string;
  helpText?: string;
  benchmark?: string;
  type: QuestionType;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  options?: QuestionOption[];
  bands?: QuestionBand[];
  /** Allow "Not sure" on numeric/percent questions */
  allowNotSure?: boolean;
  /** Risk score when user picks "Not sure" (default 50) */
  notSureRiskScore?: number;
  /** For numeric/percent: maps value to risk score 0-100 */
  scoreNumeric?: (value: number) => number;
  categoryWeights: CategoryWeight[];
  /** If true, answer is used for copy personalization only */
  qualitative?: boolean;
}

export type Answers = Record<string, string | number | boolean>;

export interface LeakScores {
  acquisition: number;
  response: number;
  conversion: number;
  retention: number;
  billing: number;
  expansion: number;
}

export interface EstimatedLosses {
  acquisition: number;
  response: number;
  conversion: number;
  retention: number;
  billing: number;
  expansion: number;
}

export interface LeakRecommendation {
  text: string;
  effort: "quick" | "medium" | "strategic";
}

export interface LeakInsight {
  category: LeakCategory;
  severity: number;
  estimatedMonthlyLoss: number;
  explanation: string;
  recommendations: LeakRecommendation[];
  benchmarkHint?: string;
}

export interface DiagnosticResult {
  businessType: BusinessType;
  leakScores: LeakScores;
  estimatedLosses: EstimatedLosses;
  totalEstimatedLoss: number;
  topLeaks: LeakInsight[];
  allLeaks: LeakInsight[];
}

export interface LossRange {
  low: number;
  high: number;
  label: string;
}
