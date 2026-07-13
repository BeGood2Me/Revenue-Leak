export interface Guide {
  slug: string;
  title: string;
  description: string;
  published: string;
  relatedSlugs: string[];
}

export const guides: Guide[] = [
  {
    slug: "revenue-leakage-analysis",
    title: "Revenue Leakage Analysis: Find Where Your Business Is Losing Money",
    description:
      "What revenue leakage means, where it hides in your funnel, and practical strategies to identify and fix leaks before they compound.",
    published: "2026-07-06",
    relatedSlugs: [
      "revenue-leakage-examples",
      "revenue-leakage-detection",
      "identify-profit-leaks",
    ],
  },
  {
    slug: "revenue-leakage-examples",
    title: "Revenue Leakage Examples: 12 Real Patterns Costing Businesses Money",
    description:
      "Concrete examples of revenue leakage across SaaS, ecommerce, agencies, and service businesses — with estimated impact and what to fix first.",
    published: "2026-07-13",
    relatedSlugs: [
      "revenue-leakage-analysis",
      "revenue-leakage-detection",
      "failed-payment-recovery",
    ],
  },
  {
    slug: "revenue-leakage-detection",
    title: "Revenue Leakage Detection: How to Find Hidden Losses in Your Funnel",
    description:
      "A step-by-step revenue leakage detection process — benchmarks, signals, and tools to spot leaks before they compound.",
    published: "2026-07-13",
    relatedSlugs: [
      "revenue-leakage-analysis",
      "identify-profit-leaks",
      "revenue-leakage-examples",
    ],
  },
  {
    slug: "identify-profit-leaks",
    title: "How to Identify Profit Leaks in Your Business (Without a Finance Team)",
    description:
      "Practical ways to identify profit leaks across acquisition, conversion, retention, and billing — even if you only have rough numbers.",
    published: "2026-07-13",
    relatedSlugs: [
      "revenue-leakage-detection",
      "revenue-leakage-examples",
      "failed-payment-recovery",
    ],
  },
  {
    slug: "failed-payment-recovery",
    title: "Failed Payment Recovery: Stop Losing Recurring Revenue to Declines",
    description:
      "Why failed payments are a silent revenue leak, how much they cost, and a recovery playbook for SaaS and subscription businesses.",
    published: "2026-07-13",
    relatedSlugs: [
      "revenue-leakage-examples",
      "identify-profit-leaks",
      "revenue-leakage-analysis",
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export const revenueLeakageAnalysisGuide = guides.find(
  (g) => g.slug === "revenue-leakage-analysis"
)!;
