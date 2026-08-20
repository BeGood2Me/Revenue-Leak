import { CANONICAL_DEFINITIONS } from "@/lib/canonical-definitions";

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
    faq: [
      {
        q: "What is an example of revenue leakage in SaaS?",
        a: "Trial users who never convert, monthly churn above 5% with no save flow, failed card charges with no dunning, or customers on the lowest tier who never see an upgrade path — each is money you almost earned but did not collect.",
      },
      {
        q: "What is an example of revenue leakage in ecommerce?",
        a: "Cart abandonment above 65% with weak recovery emails, one-time buyers who never get a second-purchase offer, refunds climbing on hero SKUs, or ad traffic landing on pages that do not match the ad promise.",
      },
      {
        q: "What is an example of revenue leakage for agencies?",
        a: "Proposals sent without follow-up within 48 hours, inbound leads answered after a full business day, retainer clients never offered adjacent services, or scope creep absorbed without change orders.",
      },
      {
        q: "What is an example of revenue leakage for local services?",
        a: "No-show rates above 10% with no reminder policy, quotes never followed up by phone or text, jobs invoiced weeks after completion, or happy customers who never rebook or leave a review.",
      },
      {
        q: "How much can revenue leakage cost per month?",
        a: "It varies by niche and funnel size. A single leak — failed payments, cart abandonment, or slow follow-up — often costs hundreds to tens of thousands per month once you multiply the gap by average order value or MRR.",
      },
      {
        q: "What should you fix first after spotting a leak example?",
        a: "The pattern with the highest estimated monthly dollar impact that you can improve within a few weeks — often response time, failed payment recovery, or one conversion bottleneck.",
      },
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
    faq: [
      {
        q: "What is revenue leakage detection?",
        a: CANONICAL_DEFINITIONS.revenueLeakageDetection.text,
      },
      {
        q: "How do you detect revenue leakage?",
        a: "Map each funnel step, compare conversion between steps to niche benchmarks, flag gaps (slow response, weak conversion, churn, failed payments), estimate monthly dollars lost at each gap, and rank fixes by impact.",
      },
      {
        q: "What are signs of revenue leakage?",
        a: "Traffic or leads look healthy but revenue lags, trial or cart conversion is below niche norms, churn or failed payments rise without a product change, or customers rarely upgrade or buy again.",
      },
      {
        q: "How often should you run revenue leakage detection?",
        a: "When growth stalls, before a major spend decision, after a pricing or funnel change, or quarterly as a health check. Detection should be repeatable — not a one-time audit.",
      },
      {
        q: "What tools do you need for revenue leakage detection?",
        a: "Stripe or your processor, Google Analytics, and your CRM or inbox are enough for a first pass. Structure matters more than enterprise analytics — ask the right questions in the right order.",
      },
    ],
  },
  {
    slug: "identify-profit-leaks",
    title: "How to Identify Profit Leaks (and Revenue Leaks) in Your Business",
    description:
      "Identify profit leaks and revenue leaks across acquisition, conversion, retention, and billing — including how to find leaks in a B2B SaaS business without a finance team.",
    published: "2026-07-13",
    updated: "2026-08-20",
    relatedSlugs: [
      "revenue-leakage-detection",
      "failed-payment-recovery",
      "revenue-leakage-analysis",
    ],
    faq: [
      {
        q: "What are profit leaks?",
        a: CANONICAL_DEFINITIONS.profitLeak.text,
      },
      {
        q: "What is profit leakage?",
        a: CANONICAL_DEFINITIONS.profitLeakage.text,
      },
      {
        q: "How do you identify profit leaks?",
        a: "Ask five measurement questions (visitor-to-customer rate, response speed, repeat purchase rate, failed payment share, and expansion asks), put a rough monthly dollar estimate on each gap, and fix the largest leak first.",
      },
      {
        q: "How do I identify revenue leaks in my B2B SaaS business?",
        a: "Measure trial-to-paid conversion, time-to-first-value, monthly involuntary churn from failed cards, expansion ask rate, and discount/refund drag. Estimate each gap in monthly dollars, then fix the largest operational leak before buying more traffic.",
      },
      {
        q: "How can I identify revenue leakage in my SaaS business without hiring more analysts?",
        a: "Use tools you already have — Stripe or your processor, product analytics, and CRM — plus five structured questions. Rough ranges beat perfect data when you need a fix-first priority in under an hour.",
      },
      {
        q: "How do you fix profit leakage?",
        a: "Rank leaks by estimated monthly dollars, fix the highest-impact operational gap you can improve in a few weeks (often response time, conversion friction, or failed payment recovery), then re-measure in 30 days.",
      },
      {
        q: "What is the difference between profit leaks and revenue leakage?",
        a: "Revenue leakage is top-line money that never gets booked. Profit leaks include that plus margin waste — discounts, refunds, and bad-fit customers that raise cost without lasting revenue.",
      },
    ],
  },
  {
    slug: "failed-payment-recovery",
    title: "Failed Payment Recovery: How to Stop Revenue Leakage from Failed Payments",
    description:
      "How to stop revenue leakage from failed payments and recover failed recurring payments — dunning, smart retries, card updates, and a DIY vs software checklist.",
    published: "2026-07-13",
    updated: "2026-08-20",
    relatedSlugs: [
      "identify-profit-leaks",
      "revenue-leakage-examples",
      "revenue-leakage-analysis",
    ],
    faq: [
      {
        q: "What is failed payment recovery?",
        a: CANONICAL_DEFINITIONS.failedPaymentRecovery.text,
      },
      {
        q: "How to stop revenue leakage from failed payments?",
        a: "Enable smart retries, send dunning emails with a one-click payment update link at each decline, pre-notify before card expiry, and outreach high-ARPU accounts that still fail.",
      },
      {
        q: "What is failed recurring payment recovery?",
        a: "Failed recurring payment recovery is the playbook for collecting declined subscription renewals: timed retries, branded dunning, card-update links, and outreach so involuntary churn does not become permanent churn.",
      },
      {
        q: "How do you recover failed recurring payments?",
        a: "Enable 3–4 automated retries over two weeks (including payday timing), send branded dunning emails with a one-click update link at each failure, and manually outreach high-ARPU accounts that still fail.",
      },
      {
        q: "What is failed payments recovery for subscriptions?",
        a: "Failed payments recovery for subscriptions is the same playbook applied to recurring charges: retries, dunning, card-update links, and outreach so a declined renewal does not become silent churn.",
      },
      {
        q: "What is recurring payment recovery?",
        a: "Recurring payment recovery (or recurring billing recovery) is the timed sequence of retries and customer outreach used to collect failed subscription invoices before access is canceled.",
      },
      {
        q: "Do I need dedicated failed payment recovery software?",
        a: "Not first. Turn on processor retries and dunning emails. Buy dedicated recovery software when failed dollars are large enough that a few extra recovery points clearly pay for the tool.",
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
