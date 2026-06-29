import Link from "next/link";
import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { LeakCard } from "@/components/LeakCard";
import { CategoryInsightRow } from "@/components/CategoryInsightRow";
import { ActionPlanSection, ReportExecutiveSummary } from "@/components/ReportSections";
import { Button } from "@/components/Button";
import { runDiagnostic } from "@/lib/diagnostic";
import { SAAS_BUSINESS_TYPE, SAAS_LEAKY_ANSWERS } from "@/lib/fixtures";
import { REPORT_PRICE_LABEL } from "@/lib/preview";
import { SITE_NAME } from "@/lib/site";
import { BUSINESS_TYPE_LABELS } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sample Report",
  description: `See what a full ${SITE_NAME} revenue leak report looks like — example output for a SaaS business.`,
  alternates: {
    canonical: "/sample-report",
  },
};

export default function SampleReportPage() {
  const full = runDiagnostic(SAAS_BUSINESS_TYPE, SAAS_LEAKY_ANSWERS);
  const topCategories = new Set(full.topLeaks.map((l) => l.category));
  const otherLeaks = full.allLeaks.filter((l) => !topCategories.has(l.category));

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Sample report.</strong> This is a redacted example for a fictional SaaS company
          (Acme Analytics). Your report is generated from your answers and business type.
        </div>

        <div className="mb-8">
          <p className="text-sm font-medium text-brand-600">
            {BUSINESS_TYPE_LABELS[SAAS_BUSINESS_TYPE]} diagnostic · Example
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Revenue Leak Report</h1>
          <p className="mt-2 text-slate-600">Acme Analytics · Sample generated report</p>
        </div>

        <ReportExecutiveSummary
          totalEstimatedLoss={full.totalEstimatedLoss}
          leakScores={full.leakScores}
          topLeaks={full.topLeaks}
        />

        <div className="mb-10 rounded-2xl border-2 border-red-200 bg-red-50 p-6 sm:p-8">
          <p className="text-sm font-medium text-red-800">Total estimated monthly revenue loss</p>
          <p className="mt-1 text-4xl font-bold text-red-700">
            {formatCurrency(full.totalEstimatedLoss)}
          </p>
          <p className="mt-2 text-sm text-red-700/80">
            Fixing your top 3 leaks could recover a meaningful share of this over the next 90 days.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Top 3 leaks to fix first</h2>
          <div className="space-y-4">
            {full.topLeaks.map((leak, i) => (
              <LeakCard key={leak.category} leak={leak} rank={i + 1} />
            ))}
          </div>
        </section>

        <ActionPlanSection topLeaks={full.topLeaks} />

        <section className="mb-12">
          <h2 className="mb-6 text-xl font-bold text-slate-900">All leak categories</h2>
          <div className="space-y-3">
            {otherLeaks.map((leak) => (
              <CategoryInsightRow key={leak.category} leak={leak} />
            ))}
          </div>
        </section>

        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">Get your own report</h2>
          <p className="mt-2 text-slate-600">
            Run the free diagnostic, then unlock your personalized full report for{" "}
            {REPORT_PRICE_LABEL}. 7-day money-back guarantee.
          </p>
          <Link href="/#start" className="mt-6 inline-block">
            <Button size="lg">Start free diagnostic</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
