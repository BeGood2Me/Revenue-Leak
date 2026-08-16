import Link from "next/link";
import { BlogFaqSection } from "@/components/blog/BlogFaqSection";
import { GuideCta } from "@/components/GuideCta";
import { GuideRelated } from "@/components/GuideRelated";
import { getGuide } from "@/lib/guides";

const guide = getGuide("revenue-leakage-examples")!;

export function RevenueLeakageExamplesContent() {
  return (
    <>
      <p>
        <strong>Revenue leakage examples</strong> help you spot problems faster than abstract
        advice. The patterns below show up across thousands of small and mid-size businesses —
        often several at once. Each example includes where the leak lives, what it looks like in
        practice, and the fix direction.
      </p>

      <h2>SaaS revenue leakage examples</h2>
      <ul>
        <li>
          <strong>Low trial-to-paid conversion.</strong> 500 trials/month at 4% convert instead of
          12% — at $150 ARPU that&apos;s roughly $6,000/month left on the table.
        </li>
        <li>
          <strong>Failed payment churn.</strong> 3–5% of active subscriptions fail billing monthly
          with no dunning — silent MRR loss that compounds.
        </li>
        <li>
          <strong>Slow demo response.</strong> Inbound demos answered after 24+ hours convert at
          half the rate of same-day follow-up.
        </li>
      </ul>
      <p>
        <Link href="/for/saas">SaaS revenue leak diagnostic →</Link>
      </p>

      <h2>Ecommerce revenue leakage examples</h2>
      <ul>
        <li>
          <strong>Cart abandonment.</strong> 70%+ of carts never checkout — even a 5-point
          recovery lift on $50k/month GMV is meaningful.
        </li>
        <li>
          <strong>No repeat purchase flow.</strong> One-and-done customers when email/SMS could
          drive a second order within 60 days.
        </li>
        <li>
          <strong>Refund spikes on hero SKUs.</strong> Product-expectation gaps eating gross
          margin on your top sellers.
        </li>
      </ul>
      <p>
        <Link href="/for/ecommerce">Ecommerce revenue leak diagnostic →</Link>
      </p>

      <h2>Agency revenue leakage examples</h2>
      <ul>
        <li>
          <strong>Proposal ghosting.</strong> 40% of sent proposals never get a follow-up call —
          deals die in the inbox.
        </li>
        <li>
          <strong>Scope creep without repricing.</strong> Extra work absorbed instead of change
          orders — margin leaks on every project.
        </li>
        <li>
          <strong>Weak upsell on retained clients.</strong> Happy clients never offered adjacent
          services you already deliver.
        </li>
      </ul>
      <p>
        <Link href="/for/agencies">Agency revenue leak diagnostic →</Link>
      </p>

      <h2>Service business revenue leakage examples</h2>
      <ul>
        <li>
          <strong>No-show appointments.</strong> 10–15% empty slots with no reminder or deposit
          policy.
        </li>
        <li>
          <strong>Slow invoicing.</strong> Work completed Friday, invoice sent two weeks later —
          cash flow and collection rates suffer.
        </li>
        <li>
          <strong>Low review velocity.</strong> Few Google reviews vs competitors — local search
          and trust leak together.
        </li>
      </ul>
      <p>
        <Link href="/for/local-services">Local service revenue leak diagnostic →</Link>
      </p>

      <h2>What to do with these examples</h2>
      <p>
        Pick the 2–3 patterns that sound uncomfortably familiar. Estimate monthly impact with
        rough math, then fix the highest-cost leak first. For a structured pass across all six
        leak categories, use our{" "}
        <Link href="/guides/revenue-leakage-detection">revenue leakage detection</Link> process or
        run the free diagnostic below.
      </p>

      <GuideCta headline="Which of these leaks apply to you?" />
      {guide.faq ? <BlogFaqSection faq={guide.faq} title="Revenue leakage examples — FAQ" /> : null}
      <GuideRelated slugs={guide.relatedSlugs} currentSlug={guide.slug} />
    </>
  );
}
