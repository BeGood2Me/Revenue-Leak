import { Suspense } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { DiagnosticWizard } from "@/components/DiagnosticWizard";
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
        <section id="start" className="surface-radar scroll-mt-24 border-b border-surface-muted">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <p className="animate-fade-up font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl">
                {SITE_NAME}
              </p>
              <h1 className="animate-fade-up-delay mt-6 text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl md:text-4xl">
                Find the top 3 places your business is leaking revenue — and what to fix first
              </h1>
              <p className="animate-fade-up-delay-2 mt-5 text-lg text-ink-muted">
                Scan your customer journey in five minutes. Get a ranked leak map tailored to SaaS,
                ecommerce, agency, or local service.
              </p>
              <p className="mt-4 text-sm text-ink-soft">
                No signup to start · ~5 minutes · Full report {REPORT_PRICE_LABEL} · 7-day
                money-back
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-3xl">
              <Suspense fallback={<WizardSkeleton />}>
                <DiagnosticWizard />
              </Suspense>
            </div>
          </div>
        </section>

        <section className="border-b border-surface-muted bg-surface-raised/70 py-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <ol className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Choose your niche",
                  desc: "SaaS, ecommerce, agency, or service — about one minute",
                },
                {
                  step: "02",
                  title: "Answer quick questions",
                  desc: "Ranges and estimates — a progress bar shows time left",
                },
                {
                  step: "03",
                  title: "See your leak map",
                  desc: `Free preview, then unlock the full report for ${REPORT_PRICE_LABEL}`,
                },
              ].map((item) => (
                <li key={item.step} className="flex gap-5 border-b border-surface-muted pb-6 last:border-0 last:pb-0">
                  <span className="font-display text-2xl font-semibold tabular-nums text-brand-600">
                    {item.step}
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-ink">{item.title}</h2>
                    <p className="mt-1 text-sm text-ink-muted">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <CredibilityBand />
          </div>
        </section>

        <FAQ />
      </main>
      <Footer />
    </>
  );
}
