export interface GuideFaqItem {
  q: string;
  a: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  published: string;
  /** ISO date when content was last substantively updated */
  updated?: string;
  relatedSlugs: string[];
  faq?: GuideFaqItem[];
}

export const guides: Guide[] = [
  {
    slug: "revenue-leakage-analysis",
    title: "Revenue Leakage Analysis: Find Where Your Business Is Losing Money",
    description:
      "Run a practical revenue leakage analysis across acquisition, conversion, retention, and billing — then rank leaks by monthly dollar impact.",
    published: "2026-07-06",
    updated: "2026-07-29",
    relatedSlugs: [
      "revenue-leakage-detection",
      "identify-profit-leaks",
      "failed-payment-recovery",
    ],
    faq: [
      {
        q: "What is revenue leakage analysis?",
        a: "A structured review of your customer journey that finds where money slips out — slow follow-up, weak conversion, churn, failed payments, or missing upsells — and estimates the monthly cost of each gap.",
      },
      {
        q: "How do you analyze revenue leakage without perfect data?",
        a: "Use ranges and benchmarks. Map each funnel step, estimate conversion between steps, compare to niche norms, and multiply the gap by average revenue per customer. Directional math beats waiting for perfect analytics.",
      },
      {
        q: "What should you fix first after a leakage analysis?",
        a: "The leak with the highest estimated monthly dollar impact that you can improve within a few weeks — often response time, failed payment recovery, or a single conversion bottleneck.",
      },
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
    title: "How to Identify Profit Leaks in Your Business (Free Diagnostic)",
    description:
      "Identify profit leaks across acquisition, conversion, retention, and billing with five questions and rough math — no finance team required.",
    published: "2026-07-13",
    updated: "2026-07-29",
    relatedSlugs: [
      "revenue-leakage-detection",
      "failed-payment-recovery",
      "revenue-leakage-analysis",
    ],
    faq: [
      {
        q: "What are profit leaks?",
        a: "Profit leaks are places where you almost earn (or keep) money but do not — lost conversions, slow follow-up, churn, failed payments, unnecessary discounts, or missing upsells. They show up as a gap between what your funnel should produce and what you actually collect.",
      },
      {
        q: "How do you identify profit leaks without a finance team?",
        a: "Ask five measurement questions (visitor-to-customer rate, response speed, repeat purchase rate, failed payment share, and expansion asks), put a rough monthly dollar estimate on each gap, and fix the largest leak first.",
      },
      {
        q: "What is the difference between profit leaks and revenue leakage?",
        a: "Revenue leakage is top-line money that never gets booked. Profit leaks include that plus margin waste — discounts, refunds, and bad-fit customers that raise cost without lasting revenue.",
      },
    ],
  },
  {
    slug: "failed-payment-recovery",
    title: "Failed Payment Recovery: Stop Revenue Leakage from Declined Charges",
    description:
      "How to stop revenue leakage from failed payments — dunning, smart retries, card updates, and a playbook to recover recurring revenue.",
    published: "2026-07-13",
    updated: "2026-08-05",
    relatedSlugs: [
      "identify-profit-leaks",
      "revenue-leakage-examples",
      "revenue-leakage-analysis",
    ],
    faq: [
      {
        q: "What is failed payment recovery?",
        a: "The process of retrying declined charges, emailing customers to update cards, and recovering revenue from involuntary churn — before those customers are lost forever.",
      },
      {
        q: "How to stop revenue leakage from failed payments?",
        a: "Enable smart retries, send dunning emails with a one-click payment update link at each decline, pre-notify before card expiry, and outreach high-ARPU accounts that still fail.",
      },
      {
        q: "How do you recover failed recurring payments?",
        a: "Enable 3–4 automated retries over two weeks (including payday timing), send branded dunning emails with a one-click update link at each failure, and manually outreach high-ARPU accounts that still fail.",
      },
      {
        q: "What recovery rate should subscription businesses aim for?",
        a: "Without a program, recovery often sits around 20–40% of failed charges. Strong dunning and retry setups commonly recover 50–70% of failed dollars.",
      },
      {
        q: "Is failed payment recovery the same as churn reduction?",
        a: "Not exactly. Voluntary churn needs product and success fixes. Failed payment recovery targets involuntary churn — operational billing failures that tooling can often fix in days.",
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export const revenueLeakageAnalysisGuide = guides.find(
  (g) => g.slug === "revenue-leakage-analysis"
)!;
