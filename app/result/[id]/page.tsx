import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { LeakCard } from "@/components/LeakCard";
import { CategoryInsightRow } from "@/components/CategoryInsightRow";
import { ActionPlanSection, ReportExecutiveSummary } from "@/components/ReportSections";
import { PrintReportButton } from "@/components/PrintReportButton";
import { Button } from "@/components/Button";
import { ReportAccessMessage } from "@/components/ReportAccessMessage";
import { prisma } from "@/lib/prisma";
import { runDiagnostic } from "@/lib/diagnostic";
import { fulfillPaidDiagnostic } from "@/lib/fulfill-diagnostic";
import {
  createReportAccessToken,
  verifyDiagnosticAccessToken,
} from "@/lib/access-token";
import {
  checkoutSessionEmail,
  getPaidCheckoutSessionForDiagnostic,
} from "@/lib/checkout-session";
import type { BusinessType } from "@/lib/types";
import { BUSINESS_TYPE_LABELS } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
  searchParams: { session_id?: string; token?: string };
}

function hasValidAccessToken(id: string, token?: string): boolean {
  return Boolean(token && verifyDiagnosticAccessToken(token, id));
}

export default async function ResultPage({ params, searchParams }: PageProps) {
  let diagnostic = await prisma.diagnostic.findUnique({
    where: { id: params.id },
  });

  if (!diagnostic) {
    notFound();
  }

  const sessionId = searchParams.session_id;

  if (sessionId) {
    const session = await getPaidCheckoutSessionForDiagnostic(params.id, sessionId);

    if (session) {
      if (!diagnostic.isPaid) {
        await fulfillPaidDiagnostic(params.id, {
          email: checkoutSessionEmail(session),
          stripeSessionId: session.id,
          stripeCustomerId:
            typeof session.customer === "string"
              ? session.customer
              : session.customer?.id ?? null,
        });
        diagnostic = await prisma.diagnostic.findUnique({
          where: { id: params.id },
        });
        if (!diagnostic) notFound();
      }

      if (!hasValidAccessToken(params.id, searchParams.token)) {
        const token = createReportAccessToken(params.id);
        redirect(`/result/${params.id}?token=${encodeURIComponent(token)}`);
      }
    }
  }

  const tokenAuthorized = hasValidAccessToken(params.id, searchParams.token);

  if (!diagnostic.isPaid) {
    if (!tokenAuthorized) {
      return (
        <ReportAccessMessage
          title="Report link required"
          description="Open the link from your diagnostic preview or complete payment to unlock this report."
        />
      );
    }

    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Report locked</h1>
            <p className="mt-2 text-slate-600">
              Complete payment to unlock your full revenue leak report.
            </p>
            <Link href="/" className="mt-6 inline-block">
              <Button>Return to diagnostic</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!tokenAuthorized) {
    return (
      <ReportAccessMessage
        title="Report link expired or missing"
        description="Use the link from your purchase confirmation email, or return from Stripe checkout immediately after paying. If you need help, contact us with the email you used at checkout."
        primaryLabel="Start a new diagnostic"
      />
    );
  }

  const answers = JSON.parse(diagnostic.answers);
  const full = runDiagnostic(diagnostic.businessType as BusinessType, answers);

  const topCategories = new Set(full.topLeaks.map((l) => l.category));
  const otherLeaks = full.allLeaks.filter((l) => !topCategories.has(l.category));

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 print:py-8">
        <div className="mb-8 print:mb-6">
          <p className="text-sm font-medium text-brand-600">
            {BUSINESS_TYPE_LABELS[diagnostic.businessType as BusinessType]} diagnostic
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Your Revenue Leak Report
          </h1>
          <p className="mt-2 text-slate-600">
            Generated {new Date(diagnostic.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {diagnostic.email && (
            <p className="mt-2 text-sm text-slate-500">
              {diagnostic.reportEmailSentAt
                ? `Report link emailed to ${diagnostic.email}`
                : `Report will be emailed to ${diagnostic.email}`}
            </p>
          )}
        </div>

        <ReportExecutiveSummary
          totalEstimatedLoss={full.totalEstimatedLoss}
          leakScores={full.leakScores}
          topLeaks={full.topLeaks}
        />

        <div className="mb-10 rounded-2xl border-2 border-red-200 bg-red-50 p-6 sm:p-8 print:break-inside-avoid">
          <p className="text-sm font-medium text-red-800">Total estimated monthly revenue loss</p>
          <p className="mt-1 text-4xl font-bold text-red-700">
            {formatCurrency(full.totalEstimatedLoss)}
          </p>
          <p className="mt-2 text-sm text-red-700/80">
            Fixing your top 3 leaks could recover a meaningful share of this over the next 90 days.
          </p>
        </div>

        <section className="mb-12 print:break-inside-avoid">
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

        <div className="no-print mt-12 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
          <PrintReportButton />
          <p className="text-sm text-slate-500">
            Or use Ctrl+P / Cmd+P to save as PDF
          </p>
        </div>
        <div className="no-print mt-6 text-center">
          <Link href="/" className="text-sm text-brand-600 hover:underline">
            Run another diagnostic
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
