import Link from "next/link";
import { Header, Footer } from "@/components/layout";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Page not found</h1>
        <p className="mt-2 text-ink-muted">
          That page doesn&apos;t exist. Try the diagnostic, or browse guides and blog posts.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
          <Link href="/?fresh=1#start" className="text-brand-700 hover:underline">
            Start diagnostic
          </Link>
          <Link href="/guides" className="text-brand-700 hover:underline">
            Guides
          </Link>
          <Link href="/blog" className="text-brand-700 hover:underline">
            Blog
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
