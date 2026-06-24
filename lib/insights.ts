import type {
  Answers,
  BusinessType,
  LeakCategory,
  LeakInsight,
  LeakRecommendation,
  LeakScores,
  EstimatedLosses,
} from "./types";
import { LEAK_CATEGORIES, LEAK_CATEGORY_LABELS } from "./types";
import { formatAnswerForInsight, formatPercentAnswer } from "./answer-format";
import { getCategoryBenchmarkHint } from "./benchmarks";

type InsightBuilder = (
  businessType: BusinessType,
  answers: Answers,
  severity: number,
  loss: number
) => { explanation: string; recommendations: LeakRecommendation[] };

function rec(text: string, effort: LeakRecommendation["effort"]): LeakRecommendation {
  return { text, effort };
}

const INSIGHTS: Record<BusinessType, Partial<Record<LeakCategory, InsightBuilder>>> = {
  saas: {
    acquisition: (bt, a) => ({
      explanation: `With ${formatAnswerForInsight(bt, "monthly_visitors", a)} monthly visitors and ${formatAnswerForInsight(bt, "monthly_signups", a)} signups (${formatPercentAnswer(bt, "visitor_signup_rate", a)} visitor-to-signup rate), your top-of-funnel is underperforming benchmarks.`,
      recommendations: [
        rec("Add a clearer primary CTA above the fold on high-traffic pages.", "quick"),
        rec("Run a 2-week test on your pricing page headline and social proof.", "medium"),
        rec("Offer a no-credit-card trial if you currently require one upfront.", "strategic"),
      ],
    }),
    conversion: (bt, a) => ({
      explanation: `Your ${formatPercentAnswer(bt, "trial_conversion_rate", a)} trial-to-paid rate suggests prospects aren't reaching value fast enough or pricing doesn't match perceived value.`,
      recommendations: [
        rec("Map your onboarding to a single 'aha moment' within the first session.", "medium"),
        rec("Send behavior-triggered emails when trial users stall on key actions.", "quick"),
        rec("Test annual pricing with a meaningful discount vs monthly-only.", "strategic"),
      ],
    }),
    retention: (bt, a) => ({
      explanation: `At ${formatPercentAnswer(bt, "monthly_churn_rate", a)} monthly churn, you're replacing customers faster than you should. Each point of churn compounds into significant lost MRR.`,
      recommendations: [
        rec("Identify your top 3 churn reasons via exit surveys and support tags.", "quick"),
        rec("Build a 30/60/90-day success playbook for new accounts.", "medium"),
        rec("Proactively reach out when usage drops below a healthy threshold.", "strategic"),
      ],
    }),
    billing: (bt, a) => ({
      explanation: `${formatPercentAnswer(bt, "failed_payment_rate", a)} failed payments plus ${a.retry_failed_payments === "no" ? "no automatic retries" : "limited recovery"} means revenue is slipping through after you've already acquired the customer.`,
      recommendations: [
        rec("Enable smart payment retries with dunning emails.", "quick"),
        rec("Add backup payment methods at checkout or in account settings.", "medium"),
        rec("Audit usage-based billing to ensure overages are captured.", "strategic"),
      ],
    }),
    expansion: (bt, a) => ({
      explanation: `With ${a.upsell_paths === "none" ? "no upsell paths" : "limited expansion motion"}, you're leaving revenue on the table from accounts that would pay more for more value.`,
      recommendations: [
        rec("Define 2–3 natural upgrade triggers based on usage limits.", "medium"),
        rec("Add in-app prompts when customers approach plan caps.", "quick"),
        rec("Bundle adjacent features into a higher tier with clear ROI.", "strategic"),
      ],
    }),
    response: (bt, a) => ({
      explanation: `Demo and pricing requests are answered in ${formatAnswerForInsight(bt, "demo_response_sla", a)} on average — slow response stalls high-intent buyers.`,
      recommendations: [
        rec("Set a 1-hour SLA for inbound sales inquiries.", "quick"),
        rec("Add live chat or chatbot for pricing page visitors.", "medium"),
      ],
    }),
  },
  ecommerce: {
    acquisition: (bt, a) => ({
      explanation: `Your ${formatPercentAnswer(bt, "add_to_cart_rate", a)} add-to-cart rate with ${formatAnswerForInsight(bt, "monthly_sessions", a)} monthly sessions suggests shoppers aren't finding products compelling enough early in the journey.`,
      recommendations: [
        rec("Improve product imagery and reviews on top 20% of SKUs.", "medium"),
        rec("Test collection page layout and filters on mobile.", "quick"),
        rec("Run retargeting to bring back bounced product viewers.", "strategic"),
      ],
    }),
    conversion: (bt, a) => ({
      explanation: `Cart abandonment at ${formatPercentAnswer(bt, "cart_abandonment_rate", a)} and checkout completion at ${formatPercentAnswer(bt, "checkout_completion_rate", a)} — plus shipping shown ${formatAnswerForInsight(bt, "shipping_cost_visibility", a)} — means you're losing buyers at the finish line.`,
      recommendations: [
        a.abandoned_cart_emails === "no"
          ? rec("Launch abandoned cart email/SMS within 1 hour of abandonment.", "quick")
          : rec("Optimize abandoned cart sequence timing and incentives.", "medium"),
        rec("Display shipping costs on product or cart pages before checkout.", "quick"),
        rec("Reduce checkout fields and offer guest checkout.", "medium"),
      ],
    }),
    retention: (bt, a) => ({
      explanation: `Only ${formatPercentAnswer(bt, "repeat_purchase_rate", a)} of customers buy again within 90 days. You're over-relying on new customer acquisition.`,
      recommendations: [
        rec("Launch a post-purchase email series with complementary products.", "quick"),
        rec("Introduce a simple loyalty or subscription program.", "medium"),
        rec("Segment win-back campaigns for 60+ day lapsed buyers.", "strategic"),
      ],
    }),
    billing: (bt, a) => ({
      explanation: `A ${formatPercentAnswer(bt, "refund_rate", a)} refund rate indicates product-expectation gaps or fulfillment issues eating into gross revenue.`,
      recommendations: [
        rec("Audit top refunded SKUs for description accuracy.", "quick"),
        rec("Tighten quality control on high-return products.", "medium"),
        rec("Offer exchanges before refunds where possible.", "strategic"),
      ],
    }),
    expansion: (bt, a) => ({
      explanation: `${a.post_purchase_upsell === "none" ? "No post-purchase upsells" : "Limited upsell flows"} mean each order captures less revenue than it could.`,
      recommendations: [
        rec("Add order bump offers on the checkout page.", "quick"),
        rec("Show 'frequently bought together' on confirmation page.", "medium"),
        rec("Test bundle discounts on related items.", "strategic"),
      ],
    }),
    response: () => ({
      explanation: "Ecommerce response leaks are usually minor unless you rely on high-touch sales.",
      recommendations: [rec("Ensure customer service responds within 4 hours on order issues.", "quick")],
    }),
  },
  agency: {
    response: (bt, a) => ({
      explanation: `Leads waiting ${formatAnswerForInsight(bt, "response_time", a)} for a first reply are likely contacting competitors. Speed-to-lead is your highest-leverage fix.`,
      recommendations: [
        rec("Set up instant auto-reply with calendar link when a lead comes in.", "quick"),
        rec("Assign a dedicated 'first responder' during business hours.", "medium"),
        rec("Use Slack/SMS alerts for new form submissions.", "quick"),
      ],
    }),
    conversion: (bt, a) => ({
      explanation: `With ${formatPercentAnswer(bt, "proposal_close_rate", a)} proposal close rate and ${formatPercentAnswer(bt, "proposal_send_rate", a)} proposal send rate, deals are stalling in your sales process.`,
      recommendations: [
        a.follow_up_system === "none"
          ? rec("Implement a CRM with defined pipeline stages this week.", "quick")
          : rec("Review stalled deals weekly and enforce follow-up tasks.", "medium"),
        rec("Standardize proposal templates with clear next steps.", "quick"),
        rec("Add a discovery call checklist to improve qualification.", "medium"),
      ],
    }),
    retention: (bt, a) => ({
      explanation: `Client lifetime of "${formatAnswerForInsight(bt, "client_lifetime", a)}" means you're constantly refilling the pipeline instead of growing accounts.`,
      recommendations: [
        rec("Schedule quarterly business reviews with top clients.", "medium"),
        rec("Create retainer or maintenance packages for one-off clients.", "strategic"),
        rec("Ask for referrals systematically after successful projects.", "quick"),
      ],
    }),
    expansion: (bt, a) => ({
      explanation: `Upsell frequency is "${formatAnswerForInsight(bt, "upsell_frequency", a)}". Existing clients are your cheapest source of new revenue.`,
      recommendations: [
        rec("Present a growth roadmap during project kickoff.", "medium"),
        rec("Proactively pitch adjacent services when you spot opportunities.", "quick"),
        rec("Bundle ongoing optimization into initial contracts.", "strategic"),
      ],
    }),
    acquisition: (bt, a) => ({
      explanation: `With ${formatAnswerForInsight(bt, "monthly_leads", a)} monthly inbound leads and ${formatPercentAnswer(bt, "discovery_booking_rate", a)} booking rate, your top-of-funnel isn't converting interest into conversations.`,
      recommendations: [
        rec("Add case studies and niche-specific landing pages.", "medium"),
        rec("Test a lead magnet aligned to your ideal client profile.", "quick"),
        rec("Improve your Google Business Profile and review count.", "quick"),
      ],
    }),
    billing: (bt, a) => ({
      explanation:
        a.overdue_invoices === "yes"
          ? "Overdue client invoices are tying up cash flow and signaling collection gaps."
          : "Billing leaks for agencies often come from unbilled scope creep and slow collections.",
      recommendations: [
        rec("Invoice within 48 hours of milestone completion.", "quick"),
        rec("Define a change-order process in every SOW.", "medium"),
        rec("Use time tracking on all client work.", "medium"),
      ],
    }),
  },
  service: {
    response: (bt, a) => ({
      explanation: `${formatPercentAnswer(bt, "missed_call_rate", a)} missed calls and ${formatAnswerForInsight(bt, "inquiry_response_time", a)} response times — with ${formatAnswerForInsight(bt, "online_booking", a)} booking — mean hot leads are going to competitors.`,
      recommendations: [
        a.online_booking === "phone_only"
          ? rec("Add online booking so customers can schedule 24/7.", "medium")
          : rec("Expand after-hours coverage to capture evening/weekend leads.", "medium"),
        rec("Use a call tracking system with missed-call auto-SMS.", "quick"),
        rec("Set a 15-minute response SLA during business hours.", "quick"),
      ],
    }),
    conversion: (bt, a) => ({
      explanation: `Booking rate of ${formatPercentAnswer(bt, "booking_rate", a)}, no-shows at ${formatPercentAnswer(bt, "no_show_rate", a)}, and ${formatPercentAnswer(bt, "quote_close_rate", a)} quote close rate compound into major lost jobs.`,
      recommendations: [
        a.quote_follow_up === "no"
          ? rec("Build a 3-touch quote follow-up sequence (day 1, 3, 7).", "quick")
          : rec("Tighten quote follow-up timing and add urgency.", "medium"),
        rec("Send appointment reminders 24h and 2h before visits.", "quick"),
        rec("Require deposits to reduce no-shows.", "medium"),
      ],
    }),
    retention: (bt, a) => ({
      explanation: `Reactivation is "${formatAnswerForInsight(bt, "reactivate_customers", a)}". Past customers and old leads are sitting untapped.`,
      recommendations: [
        rec("Run a quarterly 'check-in' campaign to past customers.", "quick"),
        rec("Offer maintenance plans for repeat revenue.", "medium"),
        rec("Re-contact quotes that didn't close after 90 days.", "quick"),
      ],
    }),
    expansion: () => ({
      explanation: "Without maintenance plans or add-on services, each job is a one-time transaction.",
      recommendations: [
        rec("Offer annual service plans at job completion.", "medium"),
        rec("Pitch upgrades (premium materials, extended warranty) on every quote.", "quick"),
      ],
    }),
    acquisition: (bt, a) => ({
      explanation: `With ${formatAnswerForInsight(bt, "monthly_leads", a)} monthly leads, even small improvements in capture rate yield significant revenue.`,
      recommendations: [
        rec("Audit Google Business Profile and local SEO.", "quick"),
        rec("Ask every happy customer for a review this month.", "quick"),
        rec("Track lead source to double down on what works.", "medium"),
      ],
    }),
    billing: (bt, a) => ({
      explanation: `No-shows at ${formatPercentAnswer(bt, "no_show_rate", a)} directly reduce billable capacity and revenue.`,
      recommendations: [
        rec("Require card-on-file or deposits for appointments.", "quick"),
        rec("Charge a no-show fee stated clearly at booking.", "medium"),
      ],
    }),
  },
};

export function buildLeakInsights(
  businessType: BusinessType,
  answers: Answers,
  scores: LeakScores,
  losses: EstimatedLosses
): LeakInsight[] {
  const nicheInsights = INSIGHTS[businessType];

  return LEAK_CATEGORIES.map((category) => {
    const severity = scores[category];
    const estimatedMonthlyLoss = losses[category];
    const builder = nicheInsights[category];
    const benchmarkHint = getCategoryBenchmarkHint(businessType, category) ?? undefined;
    const { explanation, recommendations } = builder
      ? builder(businessType, answers, severity, estimatedMonthlyLoss)
      : {
          explanation: `Your ${LEAK_CATEGORY_LABELS[category].toLowerCase()} score of ${severity}/100 indicates room for improvement.`,
          recommendations: [rec("Review this area of your customer journey for quick wins.", "quick")],
        };

    return {
      category,
      severity,
      estimatedMonthlyLoss,
      explanation,
      recommendations,
      benchmarkHint,
    };
  });
}

export function getTopLeaks(insights: LeakInsight[], count = 3): LeakInsight[] {
  return [...insights]
    .sort((a, b) => b.estimatedMonthlyLoss - a.estimatedMonthlyLoss)
    .slice(0, count);
}

export function getHeroRecommendation(topLeak: LeakInsight | undefined): string | null {
  if (!topLeak) return null;
  const quick = topLeak.recommendations.find((r) => r.effort === "quick");
  return quick?.text ?? topLeak.recommendations[0]?.text ?? null;
}
