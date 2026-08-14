import type { Answers, BusinessType } from "@/lib/types";

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

export const ECOMMERCE_LEAKY_ANSWERS: Answers = {
  biggest_frustration: "not_sure",
  monthly_sessions: "25k_100k",
  add_to_cart_rate: 12,
  checkout_completion_rate: 25,
  average_order_value: "100_200",
  cart_abandonment_rate: 85,
  shipping_cost_visibility: "late",
  abandoned_cart_emails: "no",
  repeat_purchase_rate: 10,
  refund_rate: 8,
  post_purchase_upsell: "none",
};

export const AGENCY_LEAKY_ANSWERS: Answers = {
  biggest_frustration: "not_sure",
  monthly_leads: "40_100",
  response_time: "over_24h",
  discovery_booking_rate: 45,
  proposal_send_rate: 40,
  proposal_close_rate: 10,
  avg_client_value: "15k_50k",
  client_lifetime: "long",
  follow_up_system: "none",
  overdue_invoices: "yes",
  upsell_frequency: "rare",
};

export const SERVICE_LEAKY_ANSWERS: Answers = {
  biggest_frustration: "not_sure",
  monthly_leads: "100_300",
  missed_call_rate: 30,
  inquiry_response_time: "over_4h",
  online_booking: "phone_only",
  booking_rate: 20,
  no_show_rate: 20,
  quote_close_rate: 45,
  avg_job_value: "500_1500",
  quote_follow_up: "no",
  reactivate_customers: "never",
};

export interface SampleReportProfile {
  niche: string;
  businessType: BusinessType;
  company: string;
  answers: Answers;
}

export const SAMPLE_REPORT_PROFILES: SampleReportProfile[] = [
  {
    niche: "saas",
    businessType: "saas",
    company: "Acme Analytics",
    answers: SAAS_LEAKY_ANSWERS,
  },
  {
    niche: "ecommerce",
    businessType: "ecommerce",
    company: "Northwind Market",
    answers: ECOMMERCE_LEAKY_ANSWERS,
  },
  {
    niche: "agencies",
    businessType: "agency",
    company: "Harbor Agency",
    answers: AGENCY_LEAKY_ANSWERS,
  },
  {
    niche: "local-services",
    businessType: "service",
    company: "Ridge Line Services",
    answers: SERVICE_LEAKY_ANSWERS,
  },
];

export function getSampleReportProfile(niche?: string | null): SampleReportProfile {
  return SAMPLE_REPORT_PROFILES.find((p) => p.niche === niche) ?? SAMPLE_REPORT_PROFILES[0];
}
