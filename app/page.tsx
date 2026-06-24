import { Suspense } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { DiagnosticWizard } from "@/components/DiagnosticWizard";
import { Button } from "@/components/Button";
import { FAQ, CredibilityBand } from "@/components/FAQ";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { SITE_NAME } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <FaqJsonLd />
      <Header />
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
                Free 5-minute diagnostic
              </p>
              <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Find the top 3 places your business is leaking revenue — and what to fix first
              </h1>
              <p className="mt-6 text-lg text-slate-600">
                {SITE_NAME} scans your customer journey — from first visit to repeat purchase —
                and estimates where money is slipping away each month.
              </p>
              <div className="mt-8">
                <Link href="/?fresh=1#start">
                  <Button size="lg">Start diagnostic — it&apos;s free</Button>
                </Link>
              </div>
              <p className="mt-3 text-sm text-slate-500">
                No signup required to start · Takes ~5 minutes · Pay only to unlock the full report
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-3xl gap-6 sm:grid-cols-3">
              {[
                { step: "1", title: "Choose your niche", desc: "SaaS, ecommerce, agency, or service" },
                { step: "2", title: "Answer quick questions", desc: "Ranges & estimates — no spreadsheets" },
                { step: "3", title: "See your leak map", desc: "Free preview, then unlock the full report" },
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
          <Suspense
            fallback={
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
                Loading…
              </div>
            }
          >
            <DiagnosticWizard />
          </Suspense>
        </section>

        <FAQ />
      </main>
      <Footer />
    </>
  );
}
