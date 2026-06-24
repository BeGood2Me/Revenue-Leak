import type { BusinessType, LeakCategory } from "./types";

interface BenchmarkDef {
  healthy: string;
  target?: number;
  /** When true, values above target are worse (churn, refunds, etc.) */
  higherIsWorse?: boolean;
}

/** Directional industry benchmarks cited in reports and quiz feedback */
export const BENCHMARKS: Record<BusinessType, Record<string, BenchmarkDef>> = {
  saas: {
    visitor_signup_rate: { healthy: "2–5%", target: 3 },
    trial_conversion_rate: { healthy: "8–15%", target: 12 },
    monthly_churn_rate: { healthy: "under 3% monthly", target: 3, higherIsWorse: true },
    failed_payment_rate: { healthy: "1–3%", target: 2, higherIsWorse: true },
  },
  ecommerce: {
    add_to_cart_rate: { healthy: "8–12%", target: 10 },
    checkout_completion_rate: { healthy: "50–65%", target: 60 },
    cart_abandonment_rate: { healthy: "55–70%", target: 60, higherIsWorse: true },
    repeat_purchase_rate: { healthy: "25–35%", target: 30 },
    refund_rate: { healthy: "under 3%", target: 3, higherIsWorse: true },
  },
  agency: {
    discovery_booking_rate: { healthy: "35–50%", target: 42 },
    proposal_send_rate: { healthy: "60–80%", target: 70 },
    proposal_close_rate: { healthy: "25–40%", target: 32 },
  },
  service: {
    missed_call_rate: { healthy: "under 5%", target: 5, higherIsWorse: true },
    booking_rate: { healthy: "40–55%", target: 50 },
    quote_close_rate: { healthy: "35–50%", target: 42 },
    no_show_rate: { healthy: "under 8%", target: 8, higherIsWorse: true },
  },
};

export const BENCHMARK_SOURCES =
  "Directional ranges from common B2B SaaS, ecommerce, agency, and local service industry reports — not a financial audit.";

export function getBenchmarkLine(
  businessType: BusinessType,
  questionId: string,
  answers: Record<string, string | number | boolean>
): string | null {
  const bench = BENCHMARKS[businessType]?.[questionId];
  if (!bench) return null;

  const raw = answers[questionId];
  if (raw === undefined || raw === null || raw === "" || raw === "not_sure") {
    return `Typical benchmark: ${bench.healthy}`;
  }

  if (typeof raw === "number" && bench.target !== undefined) {
    const diff = raw - bench.target;
    const threshold = bench.target * 0.3;

    if (Math.abs(diff) <= threshold) {
      return `Your ${raw}% is near typical ${bench.healthy}`;
    }

    const higherIsWorse = bench.higherIsWorse ?? false;

    if (diff > threshold) {
      return higherIsWorse
        ? `Your ${raw}% vs typical ${bench.healthy} — worse than benchmark`
        : `Your ${raw}% vs typical ${bench.healthy} — above benchmark`;
    }

    return higherIsWorse
      ? `Your ${raw}% vs typical ${bench.healthy} — better than benchmark`
      : `Your ${raw}% vs typical ${bench.healthy} — below benchmark`;
  }

  return `Typical benchmark: ${bench.healthy}`;
}

export function getCategoryBenchmarkHint(
  businessType: BusinessType,
  category: LeakCategory
): string | null {
  const hints: Partial<Record<BusinessType, Partial<Record<LeakCategory, string>>>> = {
    saas: {
      conversion: "Healthy SaaS trial-to-paid: 8–15%",
      retention: "Healthy SaaS monthly churn: under 3%",
      billing: "Typical failed payment rate: 1–3%",
      response: "Best-in-class demo response: under 1 hour",
    },
    ecommerce: {
      conversion: "Typical checkout completion: 50–65%",
      retention: "Strong repeat purchase (90d): 25–35%",
      billing: "Typical refund rate: under 3%",
    },
    agency: {
      response: "Top agencies respond to leads in under 1 hour",
      conversion: "Typical proposal close rate: 25–40%",
    },
    service: {
      response: "Healthy missed-call rate: under 5%",
      conversion: "Typical booking rate: 40–55%",
      billing: "Typical no-show rate: under 8%",
    },
  };
  return hints[businessType]?.[category] ?? null;
}
