import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { blogPillars, blogPosts } from "@/lib/blog";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `SEO guides on revenue leakage, profit leaks, funnel conversion, and billing recovery — from ${SITE_NAME}.`,
  alternates: {
    canonical: "/blog",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `Blog — ${SITE_NAME}`,
    description: "Articles on revenue leakage detection, examples, and recovery playbooks.",
    type: "website",
    url: "/blog",
  },
};

export default function BlogIndexPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold text-slate-900">Blog</h1>
        <p className="mt-4 text-lg text-slate-600">
          Topic clusters on revenue leakage, funnel profit leaks, and billing recovery — with
          cross-linked articles and free diagnostic CTAs.
        </p>

        <section className="mt-12" aria-labelledby="pillars-heading">
          <h2 id="pillars-heading" className="text-xl font-semibold text-slate-900">
            Content pillars
          </h2>
          <ul className="mt-6 space-y-4">
            {blogPillars.map((pillar) => (
              <li key={pillar.slug}>
                <Link
                  href={`/blog/pillar/${pillar.slug}`}
                  className="group block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-200 hover:shadow-md"
                >
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-700">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-slate-600">{pillar.description}</p>
                  <p className="mt-3 text-sm text-brand-600">
                    {pillar.postSlugs.length} articles →
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14" aria-labelledby="all-posts-heading">
          <h2 id="all-posts-heading" className="text-xl font-semibold text-slate-900">
            All articles
          </h2>
          <ul className="mt-6 space-y-6">
            {blogPosts.map((post) => {
              const pillar = blogPillars.find((p) => p.slug === post.pillar);
              return (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-200 hover:shadow-md"
                  >
                    {pillar ? (
                      <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
                        {pillar.title}
                      </p>
                    ) : null}
                    <h3 className="mt-1 text-xl font-semibold text-slate-900 group-hover:text-brand-700">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-slate-600">{post.description}</p>
                    <p className="mt-3 text-sm text-brand-600">Read article →</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <p className="mt-10 text-sm text-slate-500">
          Also see our{" "}
          <Link href="/guides" className="text-brand-600 hover:underline">
            longer-form guides
          </Link>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
