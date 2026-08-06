import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/Button";
import {
  getBusinessDescription,
  getBusinessLabel,
  getLeakDescription,
  getLeakLabel,
  getNicheDiagnosticHref,
  getNicheLanding,
  nicheLandings,
} from "@/lib/niche-landings";
import { getSiteUrl } from "@/lib/site";

interface PageProps {
  params: Promise<{ niche: string }>;
}

export function generateStaticParams() {
  return nicheLandings.map((landing) => ({ niche: landing.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { niche } = await params;
  const landing = getNicheLanding(niche);
  if (!landing) return {};

  return {
    title: landing.title,
    description: landing.description,
    alternates: {
      canonical: `/for/${landing.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: landing.title,
      description: landing.description,
      url: `${getSiteUrl()}/for/${landing.slug}`,
    },
  };
}

export default async function NicheLandingPage({ params }: PageProps) {
  const { niche } = await params;
  const landing = getNicheLanding(niche);

  if (!landing) {
    notFound();
  }

  const diagnosticHref = getNicheDiagnosticHref(landing.businessType);

  return (
    <>
      <Header />
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              {getBusinessLabel(landing.businessType)} · Revenue leak diagnostic
            </p>
            <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              {landing.headline}
            </h1>
            <p className="mt-6 text-lg text-slate-600">{landing.subheadline}</p>
            <p className="mt-4 text-slate-600">{getBusinessDescription(landing.businessType)}</p>
            <div className="mt-8">
              <Link href={diagnosticHref}>
                <Button size="lg">Start free {getBusinessLabel(landing.businessType)} diagnostic</Button>
              </Link>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              ~5 minutes · Free preview ·{" "}
              <Link href="/sample-report" className="text-brand-600 hover:underline">
                See a sample report
              </Link>
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900">Top leaks for {getBusinessLabel(landing.businessType)}</h2>
          <div className="mt-8 space-y-4">
            {landing.topLeaks.map((category) => (
              <div
                key={category}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="font-semibold text-slate-900">{getLeakLabel(category)}</h3>
                <p className="mt-2 text-sm text-slate-600">{getLeakDescription(category)}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-12 text-2xl font-bold text-slate-900">Sound familiar?</h2>
          <ul className="mt-6 space-y-3">
            {landing.painPoints.map((point) => (
              <li key={point} className="flex gap-3 text-slate-700">
                <span className="text-brand-600">→</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {landing.relatedGuides && landing.relatedGuides.length > 0 ? (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-slate-900">Related playbooks</h2>
              <ul className="mt-4 space-y-2">
                {landing.relatedGuides.map((guide) => (
                  <li key={guide.href}>
                    <Link href={guide.href} className="text-brand-600 hover:underline">
                      {guide.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-12 rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              Rank your top 3 leaks by estimated monthly impact
            </h2>
            <p className="mt-2 text-slate-600">
              Tailored questions for {getBusinessLabel(landing.businessType).toLowerCase()} — no
              spreadsheet required.
            </p>
            <Link href={diagnosticHref} className="mt-6 inline-block">
              <Button size="lg">Start free diagnostic</Button>
            </Link>
          </div>

          <p className="mt-10 text-center text-sm text-slate-500">
            <Link href="/guides" className="text-brand-600 hover:underline">
              Read our guides
            </Link>
            {" · "}
            <Link href="/" className="text-brand-600 hover:underline">
              Back to home
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
