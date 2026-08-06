import type { BusinessType, LeakCategory } from "@/lib/types";
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
