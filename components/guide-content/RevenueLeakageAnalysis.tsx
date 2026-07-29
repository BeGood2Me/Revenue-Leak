import Link from "next/link";
import { GuideCta } from "@/components/GuideCta";
import { GuideRelated } from "@/components/GuideRelated";
import { BlogFaqSection } from "@/components/blog/BlogFaqSection";
import { SITE_NAME } from "@/lib/site";
import { revenueLeakageAnalysisGuide as guide } from "@/lib/guides";

export function RevenueLeakageAnalysisContent() {
  return (
    <>
      <p className="rounded-lg border border-brand-200 bg-brand-50 p-4 text-slate-800">
        <strong>Quick answer:</strong> A revenue leakage analysis maps your customer journey,
        measures conversion between steps, benchmarks each rate, estimates monthly dollar impact,
        and ranks leaks so you fix the highest-cost gap first — not the loudest symptom.
      </p>

      <p>
        Revenue leakage is money your business should be earning but isn&apos;t — not because
        demand disappeared, but because something in the journey from first touch to payment
        (and repeat purchase) is broken, slow, or missing. A{" "}
        <strong>revenue leakage analysis</strong> asks: where is cash slipping out of the funnel,
        and what is it costing you each month?
      </p>

      <p>
        Most teams feel this before they can name it. Traffic looks fine. Pipeline has activity.
        Yet growth feels harder than it should. That gap is often leakage — small failures across
        several stages that add up to a large number. For definitions and search-friendly explainers,
        see{" "}
        <Link href="/blog/what-is-revenue-leakage">what is revenue leakage</Link> and the{" "}
        <Link href="/blog/pillar/revenue-leakage">revenue leakage topic cluster</Link>.
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
          <strong>Billing</strong> —{" "}
          <Link href="/guides/failed-payment-recovery">failed payments</Link>, invoice delays, or
          pricing errors.
        </li>
        <li>
          <strong>Expansion</strong> — customers who would upgrade but never see a clear offer.
        </li>
      </ul>
      <p>
        For concrete patterns by business type, see{" "}
        <Link href="/guides/revenue-leakage-examples">revenue leakage examples</Link> or niche
        pages for <Link href="/for/saas">SaaS</Link>,{" "}
        <Link href="/for/ecommerce">ecommerce</Link>,{" "}
        <Link href="/for/agencies">agencies</Link>, and{" "}
        <Link href="/for/local-services">local services</Link>.
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
        through measurement step by step. If you care about margin as well as top line, continue
        with <Link href="/guides/identify-profit-leaks">how to identify profit leaks</Link>.
      </p>

      <h2>Run a 5-minute leakage analysis</h2>
      <p>
        {SITE_NAME} walks you through acquisition, response, conversion, retention, billing, and
        expansion with quick questions — ranges, not spreadsheets. You get a free preview of your
        top leaks ranked by estimated monthly impact.
      </p>

      <GuideCta />
      {guide.faq ? <BlogFaqSection faq={guide.faq} /> : null}
      <GuideRelated slugs={guide.relatedSlugs} currentSlug={guide.slug} />
    </>
  );
}
