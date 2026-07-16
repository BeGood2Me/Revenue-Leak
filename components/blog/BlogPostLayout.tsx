import Link from "next/link";
import { BlogAuthorBox } from "@/components/blog/BlogAuthorBox";
import { Header, Footer } from "@/components/layout";
import type { BlogPillar, BlogPost } from "@/lib/blog/types";

interface BlogPostLayoutProps {
  post: BlogPost;
  pillar?: BlogPillar;
  children: React.ReactNode;
}

export function BlogPostLayout({ post, pillar, children }: BlogPostLayoutProps) {
  const published = new Date(post.published).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm text-slate-500">
          <Link href="/blog" className="text-brand-600 hover:underline">
            Blog
          </Link>
          {pillar ? (
            <>
              {" · "}
              <Link href={`/blog/pillar/${pillar.slug}`} className="text-brand-600 hover:underline">
                {pillar.title}
              </Link>
            </>
          ) : null}
          {" · "}
          {published}
        </p>
        <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-slate-600">{post.description}</p>
        <article className="mt-10 space-y-6 text-slate-700 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6">
          {children}
        </article>
        <BlogAuthorBox />
        <p className="mt-6 text-sm text-slate-500">
          <Link href="/blog" className="text-brand-600 hover:underline">
            All blog posts
          </Link>
          {" · "}
          <Link href="/guides" className="text-brand-600 hover:underline">
            Guides
          </Link>
          {" · "}
          <Link href="/" className="text-brand-600 hover:underline">
            Back to home
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
