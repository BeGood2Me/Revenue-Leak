import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { blogAuthor } from "@/lib/blog";
import { getSiteUrl, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${SITE_NAME} methodology and standards for revenue leakage research, benchmarks, and the diagnostic product.`,
  alternates: {
    canonical: "/about",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `About — ${SITE_NAME}`,
    description: blogAuthor.tagline,
    type: "website",
    url: "/about",
  },
};

export default function AboutPage() {
  const base = getSiteUrl();

  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${SITE_NAME}`,
    description: blogAuthor.bio,
    url: `${base}/about`,
    mainEntity: {
      "@type": "Organization",
      name: blogAuthor.name,
      url: base,
      description: blogAuthor.bio,
      sameAs: blogAuthor.sameAs,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold text-slate-900">About {SITE_NAME}</h1>
        <p className="mt-4 text-lg text-slate-600">{blogAuthor.tagline}</p>

        <section className="mt-10 space-y-4 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">What Revenue Leak publishes</h2>
          <p>{blogAuthor.bio}</p>
          <p>
            The blog and guides focus on revenue leakage detection, funnel optimization, and
            billing recovery—the same problem space as the{" "}
            <Link href="/?fresh=1#start" className="text-brand-600 hover:underline">
              free Revenue Leak diagnostic
            </Link>
            .
          </p>
        </section>

        <section className="mt-12 space-y-6 text-slate-700">
          <h2 id="methodology" className="text-xl font-semibold text-slate-900">
            How the score works
          </h2>
          <div className="space-y-6">
            {blogAuthor.methodology.map((item) => (
              <div key={item.title}>
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 space-y-4 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Standards</h2>
          <ul className="list-disc space-y-2 pl-6">
            {blogAuthor.credentials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
          <h2 className="text-base font-semibold text-slate-900">Important note</h2>
          <p className="mt-2">{blogAuthor.disclaimer}</p>
        </section>

        <div className="mt-10 text-center">
          <Link
            href="/?fresh=1#start"
            className="inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            Run the free diagnostic
          </Link>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          <Link href="/blog" className="text-brand-600 hover:underline">
            Blog
          </Link>
          {" · "}
          <Link href="/guides" className="text-brand-600 hover:underline">
            Guides
          </Link>
          {" · "}
          <Link href="/" className="text-brand-600 hover:underline">
            Home
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
