export interface Guide {
  slug: string;
  title: string;
  description: string;
  published: string;
}

export const guides: Guide[] = [
  {
    slug: "revenue-leakage-analysis",
    title: "Revenue Leakage Analysis: Find Where Your Business Is Losing Money",
    description:
      "What revenue leakage means, where it hides in your funnel, and practical strategies to identify and fix leaks before they compound.",
    published: "2026-07-06",
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export const revenueLeakageAnalysisGuide = guides.find(
  (g) => g.slug === "revenue-leakage-analysis"
)!;
