import Link from "next/link";
import { GuideCta } from "@/components/GuideCta";
import { GuideRelated } from "@/components/GuideRelated";
import { getGuide } from "@/lib/guides";

const guide = getGuide("identify-profit-leaks")!;

export function IdentifyProfitLeaksContent() {
  return (
    <>
      <p>
        To <strong>identify profit leaks</strong>, you do not need audited financials or a data
        team. You need to compare what should happen at each stage of your customer journey with
        what actually happens — then put a dollar estimate on the gap. Profit leaks are revenue
        leaks that survive past gross margin: money you almost earned but did not keep.
      </p>

      <h2>Profit leak vs. revenue leak</h2>
      <p>
        Revenue leakage is top-line: lost sales, churn, failed payments. Profit leakage adds
        cost-side waste — discounts you did not need to give, refunds from bad-fit customers,
        agency scope creep, ad spend on audiences that never convert. This guide focuses on
        revenue-side profit leaks founders can spot without a P&amp;L deep dive.
      </p>

      <h2>Five questions that surface profit leaks</h2>
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
          <Link href="/guides/failed-payment-recovery">failed payment recovery</Link> guide.
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

      <h2>Common mistakes when hunting profit leaks</h2>
      <ul>
        <li>Adding ad spend before fixing conversion or response leaks.</li>
        <li>Cutting price instead of fixing onboarding or proof.</li>
        <li>Treating churn as inevitable instead of measuring exit reasons.</li>
        <li>Ignoring failed payments because &quot;the number is small&quot; — it compounds.</li>
      </ul>

      <p>
        For worked examples by business type, read{" "}
        <Link href="/guides/revenue-leakage-examples">revenue leakage examples</Link>.
      </p>

      <GuideCta headline="Identify your top 3 profit leaks in 5 minutes" />
      <GuideRelated slugs={guide.relatedSlugs} currentSlug={guide.slug} />
    </>
  );
}
