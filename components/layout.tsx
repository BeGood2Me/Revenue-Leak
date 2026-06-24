import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { SITE_NAME } from "@/lib/site";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <BrandMark className="h-8 w-8 shrink-0" />
          <span>{SITE_NAME}</span>
        </Link>
        <Link href="/?fresh=1#start" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          Start diagnostic
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-slate-500 sm:px-6">
        <p>© {new Date().getFullYear()} {SITE_NAME}. Estimates are directional, not financial advice.</p>
        <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <Link href="/privacy" className="text-brand-600 hover:underline">
            Privacy
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/terms" className="text-brand-600 hover:underline">
            Terms
          </Link>
        </p>
      </div>
    </footer>
  );
}
