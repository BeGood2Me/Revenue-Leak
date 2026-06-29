import { Suspense } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { DiagnosticWizard } from "@/components/DiagnosticWizard";
import { Button } from "@/components/Button";
import { FAQ, CredibilityBand } from "@/components/FAQ";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { OrganizationJsonLd } from "@/components/OrganizationJsonLd";
import { WizardSkeleton } from "@/components/WizardSkeleton";
import { REPORT_PRICE_LABEL } from "@/lib/preview";
import { SITE_NAME } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <FaqJsonLd />
      <Header />
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
                Free 5-minute diagnostic · Works on any device
              </p>
              <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Find the top 3 places your business is leaking revenue — and what to fix first
              </h1>
              <p className="mt-6 text-lg text-slate-600">
                {SITE_NAME} scans your customer journey — from first visit to repeat purchase —
                and estimates where money is slipping away each month. Tailored to your business
                type: SaaS, ecommerce, agency, or local service.
              </p>
              <div className="mt-8">
                <Link href="/?fresh=1#start">
                  <Button size="lg">Start diagnostic — it&apos;s free</Button>
                </Link>
              </div>
              <p className="mt-3 text-sm text-slate-500">
                No signup required to start · Takes ~5 minutes · Full report {REPORT_PRICE_LABEL}{" "}
                · 7-day money-back guarantee
              </p>
              <p className="mt-2 text-sm">
                <Link href="/sample-report" className="text-brand-600 hover:underline">
                  See a sample report
                </Link>
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-3xl gap-6 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Choose your niche",
                  desc: "SaaS, ecommerce, agency, or service — visual cards, ~1 minute",
                },
                {
                  step: "2",
                  title: "Answer quick questions",
                  desc: "Ranges & estimates — progress bar shows time left",
                },
                {
                  step: "3",
                  title: "See your leak map",
                  desc: `Free preview, then unlock the full report for ${REPORT_PRICE_LABEL}`,
                },
              ].map((item) => (
                <div key={item.step} className="rounded-xl border border-slate-200 bg-white p-5 text-center">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    {item.step}
                  </div>
                  <h3 className="mt-3 font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>

            <CredibilityBand />
          </div>
        </section>

        <section id="start" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <Suspense fallback={<WizardSkeleton />}>
            <DiagnosticWizard />
          </Suspense>
        </section>

        <FAQ />
      </main>
      <Footer />
    </>
  );
}
