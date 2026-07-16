import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogFaqJsonLd } from "@/components/blog/BlogFaqJsonLd";
import { BlogFaqSection } from "@/components/blog/BlogFaqSection";
import { Header, Footer } from "@/components/layout";
import { blogPillars, getBlogPillar, getPostsForPillar } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPillars.map((pillar) => ({ slug: pillar.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pillar = getBlogPillar(slug);
  if (!pillar) return {};

  const url = `${getSiteUrl()}/blog/pillar/${pillar.slug}`;

  return {
    title: `${pillar.title} — Topic cluster`,
    description: pillar.description,
    keywords: pillar.keywords,
    alternates: {
      canonical: `/blog/pillar/${pillar.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: pillar.title,
      description: pillar.description,
      type: "website",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: pillar.title,
      description: pillar.description,
    },
  };
}

export default async function BlogPillarPage({ params }: PageProps) {
  const { slug } = await params;
  const pillar = getBlogPillar(slug);

  if (!pillar) {
    notFound();
  }

  const posts = getPostsForPillar(pillar.slug);

  return (
    <>
      <BlogFaqJsonLd faq={pillar.faq} />
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm text-slate-500">
          <Link href="/blog" className="text-brand-600 hover:underline">
            Blog
          </Link>
          {" · "}
          Content pillar
        </p>
        <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {pillar.title}
        </h1>
        <p className="mt-4 text-lg text-slate-600">{pillar.description}</p>
        <p className="mt-6 text-slate-700">{pillar.intro}</p>

        <section className="mt-12" aria-labelledby="pillar-articles-heading">
          <h2 id="pillar-articles-heading" className="text-xl font-semibold text-slate-900">
            Articles in this cluster
          </h2>
          <ol className="mt-6 space-y-4">
            {posts.map((post, index) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                    {index + 1}
                  </span>
                  <span>
                    <span className="block font-semibold text-slate-900 group-hover:text-brand-700">
                      {post.title}
                    </span>
                    <span className="mt-1 block text-sm text-slate-600">{post.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <BlogFaqSection faq={pillar.faq} title={`${pillar.title} — FAQ`} />

        <div className="mt-10 rounded-xl border border-brand-200 bg-brand-50 p-6 text-center">
          <p className="text-lg font-semibold text-slate-900">
            Find your top 3 revenue leaks in 5 minutes
          </p>
          <Link
            href="/?fresh=1#start"
            className="mt-4 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            Start free diagnostic
          </Link>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          <Link href="/blog" className="text-brand-600 hover:underline">
            All blog posts
          </Link>
          {" · "}
          <Link href="/guides" className="text-brand-600 hover:underline">
            Guides
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
