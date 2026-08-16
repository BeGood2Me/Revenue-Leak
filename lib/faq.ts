import { DEFINITION_FAQ } from "@/lib/canonical-definitions";

/** Homepage FAQ — definitions first (snippet supply), then product questions. */
export const FAQ_ITEMS = [
  ...DEFINITION_FAQ,
  {
    q: "How do you find revenue leaks?",
    a: "Map each funnel step (traffic → lead → sale → retention → billing → expansion), compare conversion to niche benchmarks, estimate monthly dollars lost at each gap, and fix the highest-impact leak you can improve in a few weeks. Our free diagnostic scores all six categories in about five minutes.",
  },
  {
    q: "What is a revenue leak diagnostic?",
    a: "A short questionnaire tailored to your business type (SaaS, ecommerce, agency, or service) that scores six leak categories, estimates monthly revenue at risk, and ranks your top three leaks with fix-first recommendations.",
  },
  {
    q: "How accurate is this?",
    a: "It's a directional diagnostic based on your answers and industry benchmarks — not a financial audit. Benchmarks are directional ranges from common SaaS, ecommerce, agency, and service industry reports. The goal is to show you where to look first and estimate rough monthly impact so you can prioritize fixes.",
  },
  {
    q: "What do I get when I unlock the full report?",
    a: "Executive summary with funnel health score, your top 3 leaks ranked by dollar impact, effort-tagged fix-first recommendations, a 30-day action plan, and expandable breakdowns for all 6 leak categories.",
  },
  {
    q: "How fast do I get access?",
    a: "Instantly. After payment you'll see your full report on-screen and receive an email with a permanent link you can return to anytime.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes — if the report doesn't give you actionable clarity on where your business is leaking revenue, contact us within 7 days for a full refund.",
  },
] as const;
