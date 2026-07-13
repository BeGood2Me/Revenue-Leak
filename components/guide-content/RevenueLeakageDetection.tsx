import Link from "next/link";
import { GuideCta } from "@/components/GuideCta";
import { GuideRelated } from "@/components/GuideRelated";
import { getGuide } from "@/lib/guides";

const guide = getGuide("revenue-leakage-detection")!;

export function RevenueLeakageDetectionContent() {
  return (
    <>
      <p>
        <strong>Revenue leakage detection</strong> is the process of finding where money leaves
        your funnel before it becomes revenue you can count on. Unlike a one-time audit, detection
        should be repeatable — you run it when growth stalls, before a big spend decision, or
        quarterly as a health check.
      </p>

      <h2>Signals that leakage is happening</h2>
      <ul>
        <li>Traffic or leads up, but revenue flat or down.</li>
        <li>High CAC with unclear payback period.</li>
        <li>Strong top-of-funnel, weak close rate.</li>
        <li>Churn or refunds higher than peers in your niche.</li>
        <li>Invoices paid late or failed card charges you never chase.</li>
      </ul>
      <p>
        If two or more apply, you almost certainly have fixable leaks — not a demand problem.
      </p>

      <h2>Detection process (about 30 minutes)</h2>
      <ol>
        <li>
          <strong>Draw the funnel.</strong> List every step from first touch to repeat purchase.
          One metric per step, even if estimated.
        </li>
        <li>
          <strong>Score each stage.</strong> Green / yellow / red against benchmarks for your
          business type. Red stages are leak candidates.
        </li>
        <li>
          <strong>Quantify impact.</strong> Lost conversions × average order value (or ARPU) =
          monthly leakage estimate.
        </li>
        <li>
          <strong>Rank by impact × ease.</strong> Quick wins on high-impact stages first.
        </li>
        <li>
          <strong>Assign owners.</strong> Each leak needs one person accountable this month.
        </li>
      </ol>

      <h2>Tools you already have</h2>
      <p>
        You do not need enterprise analytics on day one. Stripe + Google Analytics + your CRM or
        inbox is enough for a first pass. The gap is usually structure — asking the right
        questions in the right order. See{" "}
        <Link href="/guides/identify-profit-leaks">how to identify profit leaks</Link> without a
        finance team for a lighter-weight version of this process.
      </p>

      <h2>Detection vs. prevention</h2>
      <p>
        Detection tells you where you are bleeding today. Prevention is building dashboards and
        playbooks so the same leak cannot reopen — response SLAs, dunning for failed payments,
        post-purchase email flows. Start with detection; automate prevention after you fix the
        top leak.
      </p>

      <h2>Automated leakage scan in 5 minutes</h2>
      <p>
        Our diagnostic scores all six universal leak categories for your business type and ranks
        your top three by estimated monthly impact. Free preview — no spreadsheet required.
      </p>

      <GuideCta headline="Run revenue leakage detection on your business" />
      <GuideRelated slugs={guide.relatedSlugs} currentSlug={guide.slug} />
    </>
  );
}
