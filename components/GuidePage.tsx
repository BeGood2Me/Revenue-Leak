import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import type { Guide } from "@/lib/guides";

interface GuidePageProps {
  guide: Guide;
  children: React.ReactNode;
}

export function GuidePage({ guide, children }: GuidePageProps) {
  const published = new Date(guide.published).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm text-slate-500">
          <Link href="/guides" className="text-brand-600 hover:underline">
            Guides
          </Link>
          {" · "}
          {published}
        </p>
        <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {guide.title}
        </h1>
        <p className="mt-4 text-lg text-slate-600">{guide.description}</p>
        <article className="mt-10 space-y-6 text-slate-700 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_a]:text-brand-600 [&_a]:hover:underline [&_strong]:text-slate-900">
          {children}
        </article>
        <p className="mt-10 text-sm text-slate-500">
          <Link href="/guides" className="text-brand-600 hover:underline">
            All guides
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
