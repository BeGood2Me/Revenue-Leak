import Link from "next/link";
import { GuideCta } from "@/components/GuideCta";
import { GuideRelated } from "@/components/GuideRelated";
import { BlogFaqSection } from "@/components/blog/BlogFaqSection";
import { getGuide } from "@/lib/guides";

const guide = getGuide("identify-profit-leaks")!;

export function IdentifyProfitLeaksContent() {
  return (
    <>
      <p className="rounded-lg border border-brand-200 bg-brand-50 p-4 text-slate-800">
        <strong>Quick answer:</strong> To identify profit leaks, compare what should happen at
        each stage of your customer journey with what actually happens, put a monthly dollar
        estimate on the gap, and fix the largest leak first. You do not need audited financials —
        ranges and benchmarks are enough to prioritize.
      </p>

      <p>
        <strong>Profit leaks</strong> are places where you almost earn (or keep) money but do not.
        That includes lost conversions, slow follow-up, early churn,{" "}
        <Link href="/guides/failed-payment-recovery">failed payments</Link>, unnecessary discounts,
        and missing upsells. Founders often feel the problem as “growth should be easier” before
        they can name the leak.
      </p>

      <h2>Profit leak vs. revenue leak</h2>
      <p>
        Revenue leakage is top-line: sales that never close, customers who churn, charges that
        fail. Profit leaks include that plus margin waste — discounts you did not need to give,
        refunds from bad-fit customers, agency scope creep, or ad spend on audiences that never
        convert. This guide focuses on revenue-side profit leaks you can spot without a full
        P&amp;L review. For the broader framework, see{" "}
        <Link href="/guides/revenue-leakage-analysis">revenue leakage analysis</Link>.
      </p>

      <h2>Five questions that identify profit leaks</h2>
      <ol>
        <li>
          <strong>What is our visitor-to-customer rate?</strong> If unknown, that itself is a leak
          — you cannot optimize what you do not measure.
        </li>
        <li>
          <strong>How fast do we respond to inbound interest?</strong> Every hour of delay costs
          conversion in most niches.
        </li>
        <li>
          <strong>What percentage of customers buy again within 90 days?</strong> Low repeat rate
          is a retention leak.
        </li>
        <li>
          <strong>What share of card charges fail each month?</strong> See our{" "}
          <Link href="/guides/failed-payment-recovery">failed payment recovery</Link> playbook.
        </li>
        <li>
          <strong>When did we last ask happy customers to spend more?</strong> Missing expansion
          is the most ignored leak.
        </li>
      </ol>

      <h2>Rough math beats perfect data</h2>
      <p>
        Example: 1,000 site visitors → 30 leads → 6 customers at $500 = $3,000 revenue. If
        benchmark close rate suggests you should have 10 customers, you are leaking ~$2,000/month
        at the conversion stage alone. Repeat for each funnel step. The total directional loss
        tells you where to focus — even if each input is a range.
      </p>
      <p>
        Prefer a structured walkthrough? Use{" "}
        <Link href="/guides/revenue-leakage-detection">revenue leakage detection</Link> or the
        free diagnostic below.
      </p>

      <h2>Profit leaks by business type</h2>
      <ul>
        <li>
          <Link href="/for/saas">SaaS</Link> — trial conversion, involuntary churn, expansion.
        </li>
        <li>
          <Link href="/for/ecommerce">Ecommerce</Link> — cart abandonment, one-time buyers, refunds.
        </li>
        <li>
          <Link href="/for/agencies">Agencies</Link> — proposal ghosting, slow follow-up, scope creep.
        </li>
        <li>
          <Link href="/for/local-services">Local services</Link> — no-shows, unpaid invoices, weak
          reactivation.
        </li>
      </ul>

      <h2>Profit leakage recovery steps</h2>
      <ol>
        <li>List the five gaps above with a rough monthly dollar range.</li>
        <li>Pick the largest leak you can improve in under two weeks.</li>
        <li>
          If billing is in the top three, run{" "}
          <Link href="/guides/failed-payment-recovery">failed payment recovery</Link> before
          buying more traffic.
        </li>
        <li>Re-check the same metrics in 30 days to confirm the leak shrank.</li>
      </ol>

      <h2>Common mistakes when hunting profit leaks</h2>
      <ul>
        <li>Adding ad spend before fixing conversion or response leaks.</li>
        <li>Cutting price instead of fixing onboarding or proof.</li>
        <li>Treating churn as inevitable instead of measuring exit reasons.</li>
        <li>Ignoring failed payments because &quot;the number is small&quot; — it compounds.</li>
      </ul>

      <p>
        Want the short checklist version of how to{" "}
        <Link href="/blog/identify-profit-leaks">identify profit leaks</Link>? Start there, then
        return here for the longer math. For worked patterns, read{" "}
        <Link href="/guides/revenue-leakage-examples">revenue leakage examples</Link>.
      </p>

      <GuideCta headline="Identify your top 3 profit leaks in 5 minutes" />
      {guide.faq ? <BlogFaqSection faq={guide.faq} /> : null}
      <GuideRelated slugs={guide.relatedSlugs} currentSlug={guide.slug} />
    </>
  );
}
