import Link from "next/link";
import { GuideCta } from "@/components/GuideCta";
import { GuideRelated } from "@/components/GuideRelated";
import { BlogFaqSection } from "@/components/blog/BlogFaqSection";
import { getGuide } from "@/lib/guides";

const guide = getGuide("failed-payment-recovery")!;

export function FailedPaymentRecoveryContent() {
  return (
    <>
      <p className="rounded-lg border border-brand-200 bg-brand-50 p-4 text-slate-800">
        <strong>Quick answer:</strong> To stop revenue leakage from failed payments, use
        automated retries, branded dunning emails, and one-click card updates so declined
        charges become recovered revenue — not silent involuntary churn. Strong programs often
        recover 50–70% of failed dollars.
      </p>

      <p>
        <strong>Failed payment recovery</strong> is one of the highest-ROI fixes in subscription
        businesses. Card expirations, insufficient funds, and bank declines silently remove paying
        customers every month. Unlike acquisition leaks, you have already won these customers;
        recovering a failed recurring payment is cheaper than replacing the account.
      </p>

      <h2>How big is the failed payment leak?</h2>
      <p>
        If 3% of active subscriptions fail billing monthly and your average plan is $80, then 500
        active subs means ~15 failed charges — roughly <strong>$1,200/month</strong> at risk before
        any recovery. Without dunning and card-update flows, recovery often sits around 20–40%.
        Good programs recover 50–70% of failed charges.
      </p>

      <h2>How to recover failed recurring payments</h2>
      <ol>
        <li>
          <strong>Measure</strong> current failed-payment rate and the share of churn that is
          involuntary.
        </li>
        <li>
          <strong>Enable smart retries</strong> — 3–4 attempts over ~2 weeks, including payday
          timing (1st / 15th) for insufficient-funds declines.
        </li>
        <li>
          <strong>Send branded dunning emails</strong> at each failure with a one-click payment
          update link.
        </li>
        <li>
          <strong>Pre-dunning for card expiry</strong> — remind customers 30 / 14 / 7 days before
          cards expire.
        </li>
        <li>
          <strong>Manual outreach</strong> for high-ARPU accounts still failing after retries.
        </li>
        <li>
          <strong>Review recovery rate monthly</strong> — aim for 50%+ of failed dollars recovered.
        </li>
      </ol>

      <h2>Why payments fail (and first fixes)</h2>
      <ul>
        <li>
          <strong>Expired cards.</strong> Pre-dunning + in-app update prompt.
        </li>
        <li>
          <strong>Insufficient funds.</strong> Retry on paydays; use processor smart retries (e.g.
          Stripe Billing).
        </li>
        <li>
          <strong>Bank declines / fraud filters.</strong> Ask for a new method; call high-value
          accounts.
        </li>
        <li>
          <strong>No retry at all.</strong> Single failure = instant churn — the most expensive
          mistake.
        </li>
      </ul>

      <h2>Failed payment recovery vs. voluntary churn</h2>
      <p>
        Voluntary churn needs product and success fixes. Involuntary churn from billing is
        operational — often fixable in a week with tooling you may already pay for. Do not lump
        them into one churn metric or you will optimize the wrong problem. Related reading:{" "}
        <Link href="/blog/subscription-billing-leaks">subscription billing leaks</Link> and{" "}
        <Link href="/blog/failed-payment-recovery">failed payment recovery (blog)</Link>.
      </p>

      <h2>Where this fits in a full leakage analysis</h2>
      <p>
        Billing is one of six leak categories in our{" "}
        <Link href="/guides/revenue-leakage-analysis">revenue leakage analysis</Link> framework.
        Pair this playbook with{" "}
        <Link href="/guides/identify-profit-leaks">how to identify profit leaks</Link> if you are
        unsure whether billing is your largest gap. SaaS teams can start from the{" "}
        <Link href="/for/saas">SaaS diagnostic</Link>.
      </p>

      <GuideCta
        headline="See if billing is one of your top leaks"
        href="/for/saas?fresh=1#start"
      />
      {guide.faq ? <BlogFaqSection faq={guide.faq} /> : null}
      <GuideRelated slugs={guide.relatedSlugs} currentSlug={guide.slug} />
    </>
  );
}
