import { describe, it, expect } from "vitest";
import { computeLeakScores } from "@/lib/scoring";
import { estimateMonthlyLosses, sumEstimatedLosses } from "@/lib/estimation";
import { runDiagnostic } from "@/lib/diagnostic";
import { bandTotalLoss } from "@/lib/preview";
import { formatAnswerForInsight } from "@/lib/answer-format";
import { computeFunnelHealthScore } from "@/lib/health-score";

describe("SaaS scoring", () => {
  const healthyAnswers = {
    biggest_frustration: "not_sure",
    monthly_visitors: "10k_50k",
    monthly_signups: "200_1000",
    visitor_signup_rate: 4,
    trial_conversion_rate: 15,
    monthly_churn_rate: 2,
    failed_payment_rate: 1,
    retry_failed_payments: "yes",
    arpu: "100_300",
    demo_response_sla: "under_1h",
    upsell_paths: "strong",
  };

  const leakyAnswers = {
    ...healthyAnswers,
    visitor_signup_rate: 1,
    trial_conversion_rate: 3,
    monthly_churn_rate: 10,
    failed_payment_rate: 8,
    retry_failed_payments: "no",
    demo_response_sla: "over_24h",
    upsell_paths: "none",
  };

  it("assigns higher conversion score when trial conversion is low", () => {
    const healthy = computeLeakScores("saas", healthyAnswers);
    const leaky = computeLeakScores("saas", leakyAnswers);
    expect(leaky.conversion).toBeGreaterThan(healthy.conversion);
  });

  it("scores response from demo response SLA", () => {
    const healthy = computeLeakScores("saas", healthyAnswers);
    const leaky = computeLeakScores("saas", leakyAnswers);
    expect(leaky.response).toBeGreaterThan(healthy.response);
  });

  it("estimates higher total loss for leaky SaaS inputs", () => {
    const healthy = runDiagnostic("saas", healthyAnswers);
    const leaky = runDiagnostic("saas", leakyAnswers);
    expect(leaky.totalEstimatedLoss).toBeGreaterThan(healthy.totalEstimatedLoss);
  });
});

describe("Ecommerce scoring", () => {
  const healthy = {
    biggest_frustration: "not_sure",
    monthly_sessions: "25k_100k",
    add_to_cart_rate: 12,
    checkout_completion_rate: 65,
    average_order_value: "100_200",
    cart_abandonment_rate: 55,
    shipping_cost_visibility: "early",
    abandoned_cart_emails: "yes",
    repeat_purchase_rate: 35,
    refund_rate: 2,
    post_purchase_upsell: "strong",
  };

  const leaky = {
    ...healthy,
    checkout_completion_rate: 25,
    cart_abandonment_rate: 85,
    shipping_cost_visibility: "late",
    abandoned_cart_emails: "no",
    repeat_purchase_rate: 10,
    refund_rate: 8,
  };

  it("increases conversion severity with poor checkout metrics", () => {
    const h = computeLeakScores("ecommerce", healthy);
    const l = computeLeakScores("ecommerce", leaky);
    expect(l.conversion).toBeGreaterThan(h.conversion);
  });

  it("uses refund_rate in billing insights", () => {
    const result = runDiagnostic("ecommerce", leaky);
    const billing = result.allLeaks.find((l) => l.category === "billing");
    expect(billing?.explanation).toContain("8%");
  });
});

describe("Agency scoring", () => {
  const healthy = {
    biggest_frustration: "not_sure",
    monthly_leads: "40_100",
    response_time: "under_1h",
    discovery_booking_rate: 45,
    proposal_send_rate: 75,
    proposal_close_rate: 35,
    avg_client_value: "15k_50k",
    client_lifetime: "long",
    follow_up_system: "robust",
    overdue_invoices: "no",
    upsell_frequency: "frequent",
  };

  const leaky = {
    ...healthy,
    response_time: "over_24h",
    proposal_send_rate: 40,
    proposal_close_rate: 10,
    follow_up_system: "none",
    overdue_invoices: "yes",
  };

  it("flags response leak for slow agencies", () => {
    const h = computeLeakScores("agency", healthy);
    const l = computeLeakScores("agency", leaky);
    expect(l.response).toBeGreaterThan(h.response);
  });

  it("scores billing from overdue invoices", () => {
    const l = computeLeakScores("agency", leaky);
    expect(l.billing).toBeGreaterThan(0);
  });
});

describe("Service scoring", () => {
  const healthy = {
    biggest_frustration: "not_sure",
    monthly_leads: "100_300",
    missed_call_rate: 5,
    inquiry_response_time: "under_15m",
    online_booking: "online_24_7",
    booking_rate: 55,
    no_show_rate: 5,
    quote_close_rate: 45,
    avg_job_value: "500_1500",
    quote_follow_up: "yes",
    reactivate_customers: "systematically",
  };

  const leaky = {
    ...healthy,
    missed_call_rate: 30,
    inquiry_response_time: "over_4h",
    online_booking: "phone_only",
    booking_rate: 20,
    no_show_rate: 20,
    quote_follow_up: "no",
  };

  it("increases response and conversion scores for leaky service business", () => {
    const h = computeLeakScores("service", healthy);
    const l = computeLeakScores("service", leaky);
    expect(l.response).toBeGreaterThan(h.response);
    expect(l.conversion).toBeGreaterThan(h.conversion);
  });
});

describe("preview helpers", () => {
  it("bands total loss into a readable range", () => {
    const range = bandTotalLoss(5000);
    expect(range.low).toBeLessThan(range.high);
    expect(range.label).toContain("–");
  });
});

describe("answer formatting", () => {
  it("formats band labels for insights", () => {
    const label = formatAnswerForInsight("saas", "monthly_visitors", {
      monthly_visitors: "10k_50k",
    });
    expect(label).toBe("10,000 – 50,000");
    expect(label).not.toContain("10k_50k");
  });
});

describe("health score", () => {
  it("returns higher score for healthier funnel", () => {
    const healthy = computeLeakScores("saas", {
      biggest_frustration: "not_sure",
      monthly_visitors: "10k_50k",
      monthly_signups: "200_1000",
      visitor_signup_rate: 4,
      trial_conversion_rate: 15,
      monthly_churn_rate: 2,
      failed_payment_rate: 1,
      retry_failed_payments: "yes",
      arpu: "100_300",
      demo_response_sla: "under_1h",
      upsell_paths: "strong",
    });
    const leaky = computeLeakScores("saas", {
      biggest_frustration: "not_sure",
      monthly_visitors: "10k_50k",
      monthly_signups: "200_1000",
      visitor_signup_rate: 1,
      trial_conversion_rate: 3,
      monthly_churn_rate: 10,
      failed_payment_rate: 8,
      retry_failed_payments: "no",
      arpu: "100_300",
      demo_response_sla: "over_24h",
      upsell_paths: "none",
    });
    expect(computeFunnelHealthScore(healthy)).toBeGreaterThan(computeFunnelHealthScore(leaky));
  });
});

describe("severity-aligned losses", () => {
  it("returns zero loss for zero severity categories", () => {
    const scores = computeLeakScores("saas", {
      biggest_frustration: "not_sure",
      monthly_visitors: "10k_50k",
      monthly_signups: "200_1000",
      visitor_signup_rate: 4,
      trial_conversion_rate: 15,
      monthly_churn_rate: 2,
      failed_payment_rate: 1,
      retry_failed_payments: "yes",
      arpu: "100_300",
      demo_response_sla: "under_1h",
      upsell_paths: "strong",
    });
    const losses = estimateMonthlyLosses("saas", {}, scores);
    for (const cat of Object.keys(losses) as (keyof typeof losses)[]) {
      if (scores[cat] <= 0) {
        expect(losses[cat]).toBe(0);
      }
    }
  });
});

describe("insight recommendations", () => {
  it("includes effort tags on recommendations", () => {
    const result = runDiagnostic("ecommerce", {
      biggest_frustration: "not_sure",
      monthly_sessions: "25k_100k",
      add_to_cart_rate: 8,
      checkout_completion_rate: 30,
      average_order_value: "100_200",
      cart_abandonment_rate: 80,
      shipping_cost_visibility: "late",
      abandoned_cart_emails: "no",
      repeat_purchase_rate: 10,
      refund_rate: 6,
      post_purchase_upsell: "none",
    });
    const top = result.topLeaks[0];
    expect(top.recommendations[0].effort).toBeDefined();
  });
});
