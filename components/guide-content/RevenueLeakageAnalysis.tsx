import Link from "next/link";
import { GuideCta } from "@/components/GuideCta";
import { GuideRelated } from "@/components/GuideRelated";
import { SITE_NAME } from "@/lib/site";
import { revenueLeakageAnalysisGuide as guide } from "@/lib/guides";

export function RevenueLeakageAnalysisContent() {
  return (
    <>
      <p>
        Revenue leakage is money your business should be earning but isn&apos;t — not because
        demand disappeared, but because something in the journey from first touch to payment
        (and repeat purchase) is broken, slow, or missing. A{" "}
        <strong>revenue leakage analysis</strong> asks a simple question: where is cash slipping
        out of the funnel, and what is it costing you each month?
      </p>

      <p>
        Most teams feel this problem before they can name it. Traffic looks fine. Pipeline has
        activity. Yet growth feels harder than it should. That gap is often leakage — small
        failures across several stages that add up to a large number.
      </p>

      <h2>Where revenue leaks usually hide</h2>
      <p>
        Leakage rarely sits in one place. It spreads across the customer journey. These six
        areas cover most businesses:
      </p>
      <ul>
        <li>
          <strong>Acquisition</strong> — traffic that never becomes a lead because landing pages,
          offers, or targeting are misaligned.
        </li>
        <li>
          <strong>Response</strong> — leads that go cold because follow-up is slow or inconsistent.
        </li>
        <li>
          <strong>Conversion</strong> — demos, trials, or carts that stall before payment.
        </li>
        <li>
          <strong>Retention</strong> — customers who churn early or never activate.
        </li>
        <li>
          <strong>Billing</strong> — failed payments, invoice delays, or pricing errors.
        </li>
        <li>
          <strong>Expansion</strong> — customers who would upgrade but never see a clear offer.
        </li>
      </ul>
      <p>
        For concrete patterns by business type, see our{" "}
        <Link href="/guides/revenue-leakage-examples">revenue leakage examples</Link> guide.
      </p>

      <h2>Revenue leak identification strategies that work</h2>
      <ol>
        <li>
          <strong>Map the journey end to end.</strong> Write down each step from stranger to paid
          customer.
        </li>
        <li>
          <strong>Measure conversion between steps.</strong> Even rough numbers help.
        </li>
        <li>
          <strong>Benchmark each rate.</strong> Compare to norms for your niche.
        </li>
        <li>
          <strong>Estimate monthly dollar impact.</strong> Directional math beats guessing.
        </li>
        <li>
          <strong>Fix the highest-impact leak first.</strong> Rank by estimated cost, then effort.
        </li>
      </ol>
      <p>
        Our{" "}
        <Link href="/guides/revenue-leakage-detection">revenue leakage detection</Link> guide walks
        through this process step by step.
      </p>

      <h2>Run a 5-minute leakage analysis</h2>
      <p>
        {SITE_NAME} walks you through acquisition, response, conversion, retention, billing, and
        expansion with quick questions — ranges, not spreadsheets. You get a free preview of your
        top leaks ranked by estimated monthly impact.
      </p>

      <GuideCta />
      <GuideRelated slugs={guide.relatedSlugs} currentSlug={guide.slug} />
    </>
  );
}
