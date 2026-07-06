import Link from "next/link";
import type { Metadata } from "next";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { GuidePage } from "@/components/GuidePage";
import { Button } from "@/components/Button";
import { getGuide } from "@/lib/guides";
import { SITE_NAME } from "@/lib/site";

const guide = getGuide("revenue-leakage-analysis");

if (!guide) {
  throw new Error("Guide not found");
}

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: {
    canonical: `/guides/${guide.slug}`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: guide.title,
    description: guide.description,
    type: "article",
    publishedTime: guide.published,
  },
};

export default function RevenueLeakageAnalysisPage() {
  return (
    <>
      <ArticleJsonLd guide={guide} />
      <GuidePage guide={guide}>
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
            <strong>Acquisition</strong> — paid or organic traffic that never becomes a lead
            because landing pages, offers, or targeting are misaligned.
          </li>
          <li>
            <strong>Response</strong> — leads that go cold because follow-up is slow, inconsistent,
            or never happens.
          </li>
          <li>
            <strong>Conversion</strong> — demos, trials, or carts that stall before payment
            because pricing, proof, or process creates friction.
          </li>
          <li>
            <strong>Retention</strong> — customers who churn early or never activate, so revenue
            you already paid to acquire walks out the door.
          </li>
          <li>
            <strong>Billing</strong> — failed payments, invoice delays, or pricing errors that
            quietly reduce realized revenue.
          </li>
          <li>
            <strong>Expansion</strong> — existing customers who would upgrade or buy more but
            never see a clear offer.
          </li>
        </ul>
        <p>
          SaaS companies often leak in trial conversion and billing. Ecommerce in cart abandonment
          and repeat purchase. Agencies in proposal follow-up and scope creep. Service businesses
          in no-shows and slow invoicing. The pattern is the same: a stage fails, and money
          disappears.
        </p>

        <h2>Revenue leak identification strategies that work</h2>
        <p>
          You do not need a massive analytics stack to start. You need a structured way to compare
          your funnel to reasonable benchmarks and estimate impact. These strategies work for most
          small and mid-size teams:
        </p>
        <ol>
          <li>
            <strong>Map the journey end to end.</strong> Write down each step from stranger to
            paid customer (and repeat buyer). One owner per stage.
          </li>
          <li>
            <strong>Measure conversion between steps.</strong> Even rough numbers help — visitor to
            lead, lead to call, call to close, close to retained at 90 days.
          </li>
          <li>
            <strong>Benchmark each rate.</strong> If your demo-to-close rate is half the norm for
            your niche, that stage is a leak candidate.
          </li>
          <li>
            <strong>Estimate monthly dollar impact.</strong> Multiply lost conversions by average
            revenue per customer. Directional math beats guessing which problem to fix first.
          </li>
          <li>
            <strong>Fix the highest-impact leak first.</strong> Founders often add traffic or
            change pricing while response time or billing still bleeds money. Rank leaks by
            estimated cost, then by effort to fix.
          </li>
        </ol>
        <p>
          This is the core of <strong>revenue leakage analytics</strong>: not more dashboards, but
          a prioritized list of where money is lost and what to do about it.
        </p>

        <h2>Spreadsheets vs. a structured diagnostic</h2>
        <p>
          A spreadsheet audit works if you already know your numbers and have time to maintain the
          model. Many founders do not — or they optimize one metric (CPC, MRR) while ignoring
          response SLA or failed payment recovery.
        </p>
        <p>
          A structured diagnostic asks the right questions for your business type, scores risk
          across each stage, and surfaces your top leaks in minutes instead of an afternoon in
          Excel. The goal is not perfect precision; it is clarity on what to fix first.
        </p>

        <h2>Run a 5-minute leakage analysis on your business</h2>
        <p>
          {SITE_NAME} walks you through acquisition, response, conversion, retention, billing, and
          expansion with quick questions — ranges, not spreadsheets. You get a free preview of your
          top leaks ranked by estimated monthly impact. Unlock the full report for a one-time fee
          if you want fix-first recommendations, effort tags, and a 30-day action plan.
        </p>
        <p>
          No account required to start. If you have been wondering whether to spend on more ads or
          fix operations first, start here — the answer is usually in the leaks you have not
          measured yet.
        </p>

        <div className="!mt-10 rounded-xl border border-brand-200 bg-brand-50 p-6 text-center">
          <p className="text-lg font-semibold text-slate-900">
            Find your top 3 revenue leaks in 5 minutes
          </p>
          <p className="mt-2 text-slate-600">Free preview · Full report optional</p>
          <Link href="/?fresh=1#start" className="mt-4 inline-block">
            <Button size="lg">Start free diagnostic</Button>
          </Link>
        </div>
      </GuidePage>
    </>
  );
}
