import type { BusinessType, LeakCategory } from "@/lib/types";
import type { FaqItem } from "@/lib/canonical-definitions";
import { CANONICAL_DEFINITIONS } from "@/lib/canonical-definitions";
import {
  BUSINESS_TYPE_DESCRIPTIONS,
  BUSINESS_TYPE_LABELS,
  LEAK_CATEGORY_DESCRIPTIONS,
  LEAK_CATEGORY_LABELS,
} from "@/lib/types";

export interface NicheLanding {
  slug: string;
  businessType: BusinessType;
  title: string;
  description: string;
  headline: string;
  subheadline: string;
  topLeaks: LeakCategory[];
  painPoints: string[];
  relatedGuides?: { href: string; label: string }[];
  faq: FaqItem[];
}

export const nicheLandings: NicheLanding[] = [
  {
    slug: "saas",
    businessType: "saas",
    title: "Revenue Leak Diagnostic for SaaS",
    description:
      "Find where your SaaS business is leaking revenue — trial conversion, churn, failed payments, and expansion gaps.",
    headline: "Where is your SaaS leaking MRR?",
    subheadline:
      "Trials that never convert, churn you never measured, failed payments you never retry — most SaaS leaks hide in the funnel after signup.",
    topLeaks: ["conversion", "retention", "billing"],
    painPoints: [
      "Trial-to-paid rate below 10% while traffic looks healthy",
      "Monthly churn above 5% with no exit survey or save flow",
      "Failed card charges with no dunning or retry sequence",
      "No upsell path for customers already on your lowest tier",
    ],
    relatedGuides: [
      { href: "/guides/failed-payment-recovery", label: "Failed payment recovery playbook" },
      { href: "/blog/identify-profit-leaks", label: "How to identify profit leaks" },
      { href: "/guides/identify-profit-leaks", label: "Identify profit leaks (full guide)" },
    ],
    faq: [
      {
        q: "What are common SaaS revenue leaks?",
        a: "Trial-to-paid conversion below niche norms, monthly churn above 5% with no save flow, failed card charges with no dunning or retries, and customers on the lowest tier who never see an upgrade path.",
      },
      {
        q: "What is involuntary churn?",
        a: CANONICAL_DEFINITIONS.involuntaryChurn.text,
      },
      {
        q: "How much MRR can failed payments cost?",
        a: "Often 2–5% of MRR for subscription businesses without a recovery program — involuntary churn from declined cards that dunning and retries would have saved.",
      },
      {
        q: "What is a good trial-to-paid conversion rate?",
        a: "Many B2B SaaS products target 10–25% trial-to-paid depending on ACV and onboarding. Below 10% with healthy traffic often signals a conversion leak in onboarding or pricing clarity.",
      },
      {
        q: "How do you find SaaS revenue leaks?",
        a: "Score trial conversion, churn, failed payment recovery, and expansion against benchmarks, estimate monthly dollars at each gap, and fix the highest-impact leak first. Our SaaS diagnostic does this in about five minutes.",
      },
    ],
  },
  {
    slug: "ecommerce",
    businessType: "ecommerce",
    title: "Revenue Leak Diagnostic for Ecommerce",
    description:
      "Find cart abandonment, repeat purchase gaps, refund leaks, and acquisition waste in your online store.",
    headline: "Where is your store leaking revenue?",
    subheadline:
      "Most ecommerce leaks are not traffic problems — they are conversion, retention, and margin problems you can quantify.",
    topLeaks: ["conversion", "retention", "acquisition"],
    painPoints: [
      "Cart abandonment above 65% with weak recovery emails",
      "One-time buyers who never get a second-purchase offer",
      "Refund rate climbing on hero SKUs without a clear cause",
      "Paid ads sending traffic to pages that do not match the ad promise",
    ],
    faq: [
      {
        q: "What is cart abandonment as a revenue leak?",
        a: CANONICAL_DEFINITIONS.cartAbandonmentLeak.text,
      },
      {
        q: "What is a good cart abandonment rate?",
        a: "Many ecommerce stores see 60–80% abandonment. Above 65% with weak recovery emails is a common leak — shoppers intended to buy but checkout friction or follow-up failed.",
      },
      {
        q: "How do you recover abandoned cart revenue?",
        a: "Send recovery emails within an hour and day three, surface shipping and tax earlier, add trust copy near checkout, and retarget abandoners with the same offer they almost bought.",
      },
      {
        q: "What are common ecommerce revenue leaks?",
        a: "High cart abandonment, one-time buyers with no second-purchase offer, rising refunds on hero SKUs, and paid traffic landing on pages that do not match the ad promise.",
      },
      {
        q: "How do you find ecommerce revenue leaks?",
        a: "Compare cart-to-purchase rate, repeat purchase rate, and refund share to niche benchmarks, estimate monthly dollars lost, and fix the largest gap first. Our ecommerce diagnostic scores all six leak categories.",
      },
    ],
  },
  {
    slug: "agencies",
    businessType: "agency",
    title: "Revenue Leak Diagnostic for Agencies",
    description:
      "Find proposal follow-up gaps, scope creep, client retention leaks, and missed expansion revenue.",
    headline: "Where is your agency leaking margin?",
    subheadline:
      "Pipeline activity can mask response leaks, proposal ghosting, and scope creep that quietly erodes profit on every client.",
    topLeaks: ["response", "conversion", "expansion"],
    painPoints: [
      "Proposals sent without a scheduled follow-up within 48 hours",
      "Inbound leads answered after a full business day",
      "Retainer clients never offered adjacent services you already deliver",
      "Scope creep absorbed instead of documented change orders",
    ],
    faq: [
      {
        q: "What are common agency revenue leaks?",
        a: "Proposals sent without follow-up within 48 hours, inbound leads answered after a full business day, retainer clients never offered adjacent services, and scope creep absorbed without change orders.",
      },
      {
        q: "Why do agency proposals go cold?",
        a: "Often a response leak — no scheduled follow-up, unclear next step, or pricing buried in a PDF. Prospects who were interested move on before you reply.",
      },
      {
        q: "What is scope creep as a profit leak?",
        a: "Delivering work outside the agreed scope without a change order — margin leaks on every client because revenue does not match the hours you absorb.",
      },
      {
        q: "How fast should agencies respond to inbound leads?",
        a: "Same business day for qualified inbound; under one hour when possible. Leads answered after a full business day often convert at half the rate of fast replies.",
      },
      {
        q: "How do you find agency revenue leaks?",
        a: "Track proposal follow-up rate, lead response time, scope change documentation, and expansion offers on retainers. Our agency diagnostic estimates monthly impact across six leak categories.",
      },
    ],
  },
  {
    slug: "local-services",
    businessType: "service",
    title: "Revenue Leak Diagnostic for Local & Service Businesses",
    description:
      "Find no-show leaks, slow invoicing, low repeat bookings, and local visibility gaps in your service business.",
    headline: "Where is your service business leaking cash?",
    subheadline:
      "Empty appointment slots, late invoices, and weak follow-up cost local businesses thousands per month — often more than ad spend.",
    topLeaks: ["response", "conversion", "retention"],
    painPoints: [
      "No-show rate above 10% with no reminder or deposit policy",
      "Quotes sent but never followed up by phone or text",
      "Jobs completed but invoiced days or weeks later",
      "Happy customers who never leave a Google review or rebook",
    ],
    faq: [
      {
        q: "What are common local service revenue leaks?",
        a: "No-show rates above 10% without reminders or deposits, quotes never followed up, jobs invoiced weeks late, and happy customers who never rebook or leave a review.",
      },
      {
        q: "How much do no-shows cost a service business?",
        a: "At 10–15% no-show rates on a full book, many operators lose thousands per month in empty slots — often more than their ad spend.",
      },
      {
        q: "Why is slow invoicing a revenue leak?",
        a: "Cash collection drops when invoices go out days or weeks after the job. Late invoices also signal lower priority to customers who might dispute or delay payment.",
      },
      {
        q: "How fast should local businesses follow up on quotes?",
        a: "Within 24 hours by phone or text — same day for hot leads. Quotes without follow-up within 48 hours often go cold.",
      },
      {
        q: "How do you find revenue leaks in a service business?",
        a: "Measure no-show rate, quote follow-up, days-to-invoice, repeat booking rate, and review velocity against local norms. Our local-services diagnostic ranks your top three leaks by estimated monthly impact.",
      },
    ],
  },
];

export function getNicheLanding(slug: string): NicheLanding | undefined {
  return nicheLandings.find((n) => n.slug === slug);
}

export function getNicheDiagnosticHref(businessType: BusinessType): string {
  const landing = nicheLandings.find((n) => n.businessType === businessType);
  const niche = landing?.slug ?? businessType;
  return `/?fresh=1&niche=${niche}#start`;
}

export function getLeakLabel(category: LeakCategory): string {
  return LEAK_CATEGORY_LABELS[category];
}

export function getLeakDescription(category: LeakCategory): string {
  return LEAK_CATEGORY_DESCRIPTIONS[category];
}

export function getBusinessLabel(businessType: BusinessType): string {
  return BUSINESS_TYPE_LABELS[businessType];
}

export function getBusinessDescription(businessType: BusinessType): string {
  return BUSINESS_TYPE_DESCRIPTIONS[businessType];
}
