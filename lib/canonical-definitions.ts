/** Shared FAQ shape for homepage, guides, niche pages, and llms.txt. */
export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Canonical snippet sentences — reuse verbatim across pages so AI and search
 * systems see consistent definitions (AEO / snippet-first retrieval).
 */
export const CANONICAL_DEFINITIONS = {
  revenueLeakage: {
    term: "Revenue leakage",
    text: "Money you should have earned but did not — because a step in your funnel failed (slow follow-up, declined card, abandoned cart), not because demand disappeared.",
  },
  revenueLeak: {
    term: "Revenue leak",
    text: "A specific gap in your funnel — for example failed card charges, abandoned carts, or slow demo follow-up — that systematically reduces what you collect each month.",
  },
  profitLeakage: {
    term: "Profit leakage",
    text: "The ongoing loss of margin or collectible revenue from operational gaps — lost conversions, slow follow-up, churn, failed payments, unnecessary discounts, or missing upsells.",
  },
  profitLeak: {
    term: "Profit leak",
    text: "A place where you almost earn or keep money but do not — the same operational gaps as profit leakage, usually phrased as one concrete gap rather than a pattern.",
  },
  failedPaymentRecovery: {
    term: "Failed payment recovery",
    text: "Retrying declined charges, emailing customers to update cards, and recovering revenue from involuntary churn before those customers are lost.",
  },
  involuntaryChurn: {
    term: "Involuntary churn",
    text: "Customers who leave because a card declined or billing failed — not because they chose to cancel. Failed payment recovery targets involuntary churn.",
  },
  cartAbandonmentLeak: {
    term: "Cart abandonment (as a revenue leak)",
    text: "Revenue lost when shoppers add items but never complete checkout — often from surprise costs at checkout, weak trust copy, or no cart-recovery follow-up.",
  },
  revenueLeakageDetection: {
    term: "Revenue leakage detection",
    text: "A repeatable process to find where money leaves your funnel before it becomes revenue you can count on — mapping each step, comparing to benchmarks, and estimating monthly dollar impact.",
  },
} as const;

/** Definition-first FAQ blocks for llms.txt and reuse on marketing pages. */
export const DEFINITION_FAQ: FaqItem[] = [
  {
    q: "What is revenue leakage?",
    a: CANONICAL_DEFINITIONS.revenueLeakage.text,
  },
  {
    q: "What is a revenue leak?",
    a: CANONICAL_DEFINITIONS.revenueLeak.text,
  },
  {
    q: "What is profit leakage?",
    a: CANONICAL_DEFINITIONS.profitLeakage.text,
  },
  {
    q: "What is the difference between revenue leakage and profit leakage?",
    a: "Revenue leakage is top-line money that never gets booked. Profit leakage also includes margin waste — discounts, refunds, and scope you absorb without matching revenue.",
  },
  {
    q: "What is failed payment recovery?",
    a: CANONICAL_DEFINITIONS.failedPaymentRecovery.text,
  },
  {
    q: "What is involuntary churn?",
    a: CANONICAL_DEFINITIONS.involuntaryChurn.text,
  },
];

/** Primary citation URLs for AI / llms.txt (guides before blog twins). */
export const PRIMARY_GUIDE_PATHS = [
  "/guides/failed-payment-recovery",
  "/guides/identify-profit-leaks",
  "/guides/revenue-leakage-analysis",
  "/guides/revenue-leakage-detection",
  "/guides/revenue-leakage-examples",
] as const;
