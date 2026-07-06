import Link from "next/link";
import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { guides } from "@/lib/guides";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guides",
  description: `Practical guides on revenue leakage analysis and finding where your business is losing money — from ${SITE_NAME}.`,
  alternates: {
    canonical: "/guides",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GuidesIndexPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold text-slate-900">Guides</h1>
        <p className="mt-4 text-lg text-slate-600">
          Short, practical reads on finding and fixing revenue leaks in your business.
        </p>
        <ul className="mt-10 space-y-6">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={`/guides/${guide.slug}`}
                className="group block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-200 hover:shadow-md"
              >
                <h2 className="text-xl font-semibold text-slate-900 group-hover:text-brand-700">
                  {guide.title}
                </h2>
                <p className="mt-2 text-slate-600">{guide.description}</p>
                <p className="mt-3 text-sm text-brand-600">Read guide →</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
