import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { LEGAL_LAST_UPDATED } from "@/lib/site";

interface LegalPageProps {
  title: string;
  children: React.ReactNode;
}

export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm text-slate-500">Last updated: {LEGAL_LAST_UPDATED}</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
        <div className="mt-8 space-y-6 text-slate-700 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_a]:text-brand-600 [&_a]:hover:underline [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:text-sm">
          {children}
        </div>
        <p className="mt-10 text-sm text-slate-500">
          <Link href="/" className="text-brand-600 hover:underline">
            Back to home
          </Link>
          {" · "}
          <Link href="/privacy" className="text-brand-600 hover:underline">
            Privacy
          </Link>
          {" · "}
          <Link href="/terms" className="text-brand-600 hover:underline">
            Terms
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
