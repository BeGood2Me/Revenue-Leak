import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/Button";
import { getContactEmail } from "@/lib/site";

interface ReportAccessMessageProps {
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
}

export function ReportAccessMessage({
  title,
  description,
  primaryHref = "/",
  primaryLabel = "Return to diagnostic",
}: ReportAccessMessageProps) {
  const contactEmail = getContactEmail();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-600">{description}</p>
        {contactEmail ? (
          <p className="mt-4 text-sm text-slate-600">
            Need help?{" "}
            <a href={`mailto:${contactEmail}`} className="text-brand-600 hover:underline">
              Contact support
            </a>
          </p>
        ) : null}
        <Link href={primaryHref} className="mt-6 inline-block">
          <Button>{primaryLabel}</Button>
        </Link>
      </main>
      <Footer />
    </>
  );
}
