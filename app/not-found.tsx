import Link from "next/link";
import { Header, Footer } from "@/components/layout";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Report not found</h1>
        <p className="mt-2 text-slate-600">
          This diagnostic doesn&apos;t exist or the link may have expired.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-brand-600 hover:underline"
        >
          Start a new diagnostic
        </Link>
      </main>
      <Footer />
    </>
  );
}
