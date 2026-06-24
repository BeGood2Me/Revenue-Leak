import type { Answers, BusinessType, LeakCategory } from "./types";
import { LEAK_CATEGORY_LABELS } from "./types";

const FRUSTRATION_COPY: Record<BusinessType, Record<string, string>> = {
  saas: {
    getting_signups: "Based on your answers, signup and trial volume look like the biggest bottleneck.",
    converting_trials: "Your trial-to-paid conversion is likely where the most revenue is stuck.",
    keeping_customers: "Churn and retention appear to be your primary revenue drag.",
    growing_accounts: "Expansion and upsell gaps are standing out in your responses.",
    not_sure: "We found meaningful leaks across your funnel — here's where to start.",
  },
  ecommerce: {
    getting_traffic: "Traffic and top-of-funnel conversion look like your main growth constraint.",
    cart_checkout: "Cart and checkout friction appear to be costing you the most.",
    repeat_customers: "Repeat purchase and retention gaps are likely your biggest leak.",
    average_order: "Order value and upsell opportunities look under-optimized.",
    not_sure: "We found meaningful leaks across your store — here's where to start.",
  },
  agency: {
    getting_leads: "Lead volume and pipeline top-of-funnel look like the main constraint.",
    closing_deals: "Proposal and close rates appear to be where deals are stalling.",
    client_retention: "Client lifetime and retention look like your biggest long-term leak.",
    slow_response: "Response time and follow-up gaps are likely costing you deals.",
    not_sure: "We found meaningful leaks in your sales process — here's where to start.",
  },
  service: {
    getting_leads: "Lead volume and missed opportunities look like the top constraint.",
    booking_jobs: "Booking and quote conversion appear to be your biggest leak.",
    repeat_business: "Reactivation and repeat business gaps stand out in your answers.",
    slow_response: "Response time and missed calls are likely costing you jobs.",
    not_sure: "We found meaningful leaks in your customer journey — here's where to start.",
  },
};

export function getPersonalizedPreviewLine(
  businessType: BusinessType,
  answers: Answers,
  topLeakCategory: LeakCategory
): string {
  const frustration = answers.biggest_frustration
    ? String(answers.biggest_frustration)
    : "not_sure";

  const byFrustration = FRUSTRATION_COPY[businessType][frustration];
  if (byFrustration) return byFrustration;

  return `Your #1 leak is ${LEAK_CATEGORY_LABELS[topLeakCategory].toLowerCase()} — unlock the full report to see exactly how much it's costing you.`;
}

export function getStepLabel(businessType: BusinessType, stepIndex: number): string {
  const labels: Record<BusinessType, string[]> = {
    saas: ["Your situation", "Funnel metrics", "Conversion & retention", "Response & growth"],
    ecommerce: ["Your situation", "Traffic & cart", "Checkout & orders", "Retention & upsell"],
    agency: ["Your situation", "Leads & response", "Sales pipeline", "Clients & growth"],
    service: ["Your situation", "Leads & response", "Bookings & quotes", "Retention & coverage"],
  };

  return labels[businessType][stepIndex] ?? `Step ${stepIndex + 1}`;
}
