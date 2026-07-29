import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import type { Guide } from "@/lib/guides";

interface GuidePageProps {
  guide: Guide;
  children: React.ReactNode;
}

export function GuidePage({ guide, children }: GuidePageProps) {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const published = formatDate(guide.published);
  const updated = guide.updated ? formatDate(guide.updated) : null;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm text-ink-soft">
          <Link href="/guides" className="text-brand-700 hover:underline">
            Guides
          </Link>
          {" · "}
          {updated ? `Updated ${updated}` : published}
        </p>
        <h1 className="mt-2 text-balance font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {guide.title}
        </h1>
        <p className="mt-4 text-lg text-ink-muted">{guide.description}</p>
        <article className="mt-10 space-y-6 text-ink-muted [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_a]:text-brand-700 [&_a]:hover:underline [&_strong]:text-ink">
          {children}
        </article>
        <p className="mt-10 text-sm text-ink-soft">
          <Link href="/guides" className="text-brand-700 hover:underline">
            All guides
          </Link>
          {" · "}
          <Link href="/blog" className="text-brand-700 hover:underline">
            Blog
          </Link>
          {" · "}
          <Link href="/" className="text-brand-700 hover:underline">
            Back to home
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
