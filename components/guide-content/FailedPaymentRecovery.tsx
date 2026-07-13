import Link from "next/link";
import { GuideCta } from "@/components/GuideCta";
import { GuideRelated } from "@/components/GuideRelated";
import { getGuide } from "@/lib/guides";

const guide = getGuide("failed-payment-recovery")!;

export function FailedPaymentRecoveryContent() {
  return (
    <>
      <p>
        <strong>Failed payment recovery</strong> is one of the highest-ROI fixes in recurring
        revenue — yet many teams ignore it. Card expirations, insufficient funds, and bank
        declines silently remove paying customers every month. Unlike acquisition leaks, you have
        already won these customers; recovery is cheaper than replacement.
      </p>

      <h2>How big is the leak?</h2>
      <p>
        If 3% of active subscriptions fail billing monthly and your average plan is $80, then 500
        active subs means ~15 failed charges — roughly <strong>$1,200/month</strong> at risk before
        any recovery. Without dunning emails and card-update flows, industry recovery rates often
        sit around 20–40%. Good programs recover 50–70% of failed charges.
      </p>

      <h2>Why payments fail (and what to do)</h2>
      <ul>
        <li>
          <strong>Expired cards.</strong> Pre-dunning emails 30/14/7 days before expiry; in-app
          card update prompt.
        </li>
        <li>
          <strong>Insufficient funds.</strong> Retry on paydays (1st and 15th); smart retry
          schedules via Stripe Billing or similar.
        </li>
        <li>
          <strong>Bank declines / fraud filters.</strong> Ask customer to update payment method;
          support outreach for high-value accounts.
        </li>
        <li>
          <strong>No retry at all.</strong> Single failure = instant churn — the most expensive
          mistake.
        </li>
      </ul>

      <h2>Recovery playbook (first 30 days)</h2>
      <ol>
        <li>Measure current failed-payment rate and involuntary churn share.</li>
        <li>Enable automated retries (3–4 attempts over 2 weeks).</li>
        <li>Send branded dunning emails at each failure with one-click update link.</li>
        <li>Flag accounts still failing after retries for manual outreach if ARPU justifies it.</li>
        <li>Review recovery rate monthly; aim for 50%+ of failed dollars recovered.</li>
      </ol>

      <h2>Failed payments vs. voluntary churn</h2>
      <p>
        Voluntary churn needs product and success fixes. Involuntary churn from billing is
        operational — often fixable in a week with tooling you may already pay for. Do not lump
        them in one &quot;churn rate&quot; metric or you will optimize the wrong problem.
      </p>

      <p>
        Billing is one of six leak categories in our{" "}
        <Link href="/guides/revenue-leakage-analysis">revenue leakage analysis</Link> framework.
        SaaS founders can run a full pass including failed payments in the diagnostic below.
      </p>

      <GuideCta
        headline="See if billing is one of your top leaks"
        href="/?fresh=1&niche=saas#start"
      />
      <GuideRelated slugs={guide.relatedSlugs} currentSlug={guide.slug} />
    </>
  );
}
