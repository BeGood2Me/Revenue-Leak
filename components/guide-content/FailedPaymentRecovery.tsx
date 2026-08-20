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
        <strong>Failed payment recovery</strong> (also called failed payments recovery or
        recurring billing recovery) is one of the highest-ROI fixes in subscription businesses.
        Card expirations, insufficient funds, and bank declines silently remove paying customers
        every month. Unlike acquisition leaks, you have already won these customers; recovering a
        failed recurring payment is cheaper than replacing the account.
      </p>

      <h2>How big is the failed payment leak?</h2>
      <p>
        If 3% of active subscriptions fail billing monthly and your average plan is $80, then 500
        active subs means ~15 failed charges — roughly <strong>$1,200/month</strong> at risk before
        any recovery. Without dunning and card-update flows, recovery often sits around 20–40%.
        Good programs recover 50–70% of failed charges.
      </p>

      <h2>How to stop revenue leakage from failed payments</h2>
      <p>
        To stop revenue leakage from failed payments, treat every decline as recoverable MRR until
        proven otherwise. Failed recurring payment recovery is usually faster ROI than new
        acquisition: you already acquired the customer — you just need a working card on file.
      </p>
      <ol>
        <li>Turn on processor smart retries (do not cancel on the first decline).</li>
        <li>Send branded dunning with a one-click update-payment link at each failure.</li>
        <li>Remind customers before cards expire (30 / 14 / 7 days).</li>
        <li>Call or email high-ARPU accounts still failing after two retries.</li>
        <li>Track recovered dollars ÷ failed dollars weekly.</li>
      </ol>

      <h2>Failed recurring payment recovery playbook</h2>
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

      <h2>Failed payments recovery checklist</h2>
      <p>
        Use this short list when you want failed payments recovery without buying new software
        first:
      </p>
      <ul>
        <li>Confirm your processor retries declines (and that retries are not disabled).</li>
        <li>Turn on customer emails for payment failure with a hosted update-card link.</li>
        <li>Schedule pre-expiry reminders for cards ending in the next 30 days.</li>
        <li>Export accounts that failed 2+ times and call or email the highest-ARPU ones.</li>
        <li>Track recovered dollars / failed dollars as a weekly metric.</li>
      </ul>

      <h2>Recurring billing recovery cadence</h2>
      <p>
        Recurring billing recovery works best as a timed sequence, not a one-off email:
      </p>
      <ol>
        <li>
          <strong>Day 0:</strong> Soft decline → automatic retry + first dunning email.
        </li>
        <li>
          <strong>Day 2–3:</strong> Second retry; reminder with urgency but no shame language.
        </li>
        <li>
          <strong>Day 7:</strong> Third retry around payday when NSF is common.
        </li>
        <li>
          <strong>Day 10–14:</strong> Final notice; pause access only after you have offered an
          easy update path.
        </li>
        <li>
          <strong>High ARPU:</strong> Human outreach in parallel after the second failure.
        </li>
      </ol>

      <h2>DIY failed payment recovery vs recovery software</h2>
      <p>
        Most teams should start with what they already pay for — Stripe Billing, Chargebee, or
        Paddle retry + email settings cover a large share of failed recurring payment recovery.
        Dedicated recovery software (smarter retry logic, account updater networks, multi-channel
        dunning) helps when failed dollars are large enough that a few extra recovery points pay
        for the tool. If you are still on a single decline = cancel policy, fix that before
        evaluating vendors.
      </p>

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
        <Link href="/guides/identify-profit-leaks">how to identify profit leaks</Link> or the short{" "}
        <Link href="/blog/identify-profit-leaks">identify profit leaks</Link> brief if you are
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
