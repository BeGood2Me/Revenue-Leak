import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { blogPillars } from "@/lib/blog";
import { getContactEmail, SITE_NAME } from "@/lib/site";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <BrandMark className="h-8 w-8 shrink-0" />
          <span>{SITE_NAME}</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/blog" className="font-medium text-slate-600 hover:text-brand-700">
            Blog
          </Link>
          <Link href="/guides" className="hidden font-medium text-slate-600 hover:text-brand-700 sm:inline">
            Guides
          </Link>
          <Link href="/?fresh=1#start" className="font-medium text-brand-600 hover:text-brand-700">
            Start diagnostic
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  const contactEmail = getContactEmail();

  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-slate-500 sm:px-6">
        <p>© {new Date().getFullYear()} {SITE_NAME}. Estimates are directional, not financial advice.</p>
        <nav
          className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm"
          aria-label="Footer navigation"
        >
          <Link href="/blog" className="text-brand-600 hover:underline">
            Blog
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/guides" className="text-brand-600 hover:underline">
            Guides
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/sample-report" className="text-brand-600 hover:underline">
            Sample report
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/about" className="text-brand-600 hover:underline">
            About
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/privacy" className="text-brand-600 hover:underline">
            Privacy
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/terms" className="text-brand-600 hover:underline">
            Terms
          </Link>
          {contactEmail ? (
            <>
              <span aria-hidden="true">·</span>
              <a href={`mailto:${contactEmail}`} className="text-brand-600 hover:underline">
                Support
              </a>
            </>
          ) : null}
        </nav>
        <nav
          className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-slate-500"
          aria-label="Content pillars"
        >
          <span className="w-full text-center text-xs uppercase tracking-wide text-slate-400 sm:w-auto sm:text-left">
            Topics
          </span>
          {blogPillars.map((pillar, i) => (
            <span key={pillar.slug} className="inline-flex items-center gap-3">
              {i > 0 ? <span aria-hidden="true">·</span> : null}
              <Link
                href={`/blog/pillar/${pillar.slug}`}
                className="text-brand-600 hover:underline"
              >
                {pillar.title}
              </Link>
            </span>
          ))}
        </nav>
      </div>
    </footer>
  );
}
