import type { Answers } from "@/lib/types";

/** Leaky SaaS profile — used for sample report UI and tests. */
export const SAAS_LEAKY_ANSWERS: Answers = {
  biggest_frustration: "not_sure",
  monthly_visitors: "10k_50k",
  monthly_signups: "200_1000",
  visitor_signup_rate: 1.5,
  trial_conversion_rate: 5,
  monthly_churn_rate: 8,
  failed_payment_rate: 4,
  retry_failed_payments: "no",
  arpu: "100_300",
  demo_response_sla: "over_24h",
  upsell_paths: "none",
};

export const SAAS_BUSINESS_TYPE = "saas" as const;
