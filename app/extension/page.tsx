import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/Button";
import { getSiteUrl, SITE_NAME } from "@/lib/site";

/** Set this after the Chrome Web Store listing is live. */
const CHROME_WEB_STORE_URL = "";

export const metadata: Metadata = {
  title: "Chrome extension",
  description: `Install Revenue Leak Check — scan the site in your current tab for missing CTAs, buried contact, and checkout leaks, then run the ${SITE_NAME} diagnostic.`,
  alternates: {
    canonical: "/extension",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `Chrome extension — ${SITE_NAME}`,
    description:
      "Scan this tab for revenue leaks. Score plus top 3 issues, then the full diagnostic.",
    type: "website",
    url: "/extension",
  },
};

export default function ExtensionPage() {
  const base = getSiteUrl();

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Revenue Leak Check",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Chrome",
    url: `${base}/extension`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Chrome extension that scans the current tab for on-page revenue-leak signals and links to the full diagnostic.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Chrome extension
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Revenue Leak Check
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Audit the site in your current tab — your homepage, pricing, checkout, or billing page.
          Get a tightness score and the top 3 issues, then run the full {SITE_NAME} diagnostic.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {CHROME_WEB_STORE_URL ? (
            <a href={CHROME_WEB_STORE_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg">Add to Chrome</Button>
            </a>
          ) : (
            <Link href="/?fresh=1#start">
              <Button size="lg">Run the full diagnostic</Button>
            </Link>
          )}
          <Link
            href="/privacy"
            className="inline-flex items-center text-sm font-medium text-brand-700 hover:underline"
          >
            Privacy
          </Link>
        </div>

        <section className="mt-12 space-y-4 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">What it checks</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>No pricing path or primary call to action</li>
            <li>Contact missing or buried below the fold</li>
            <li>Shipping or tax sprung at checkout</li>
            <li>Stores with no cart-recovery language</li>
            <li>Billing pages with no update-card / failed-payment path</li>
          </ul>
          <p>
            It does not scrape Google Search Console, Stripe, or other people&apos;s dashboards. It
            only looks at the tab you click it on.
          </p>
        </section>

        <section className="mt-12 space-y-4 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Install</h2>
          {CHROME_WEB_STORE_URL ? (
            <p>
              Install from the{" "}
              <a
                href={CHROME_WEB_STORE_URL}
                className="text-brand-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chrome Web Store
              </a>
              , then open your own site and click the toolbar icon.
            </p>
          ) : (
            <>
              <p>
                The Chrome Web Store listing is in review. Until it is live, you can load the
                unpacked extension from the GitHub repo:
              </p>
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  Open{" "}
                  <a
                    href="https://github.com/BeGood2Me/Revenue-Leak/tree/main/extension"
                    className="text-brand-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    the extension folder
                  </a>
                </li>
                <li>
                  Chrome → <code>chrome://extensions</code> → enable Developer mode → Load unpacked
                  → select that folder
                </li>
                <li>Open your site and click Revenue Leak Check in the toolbar</li>
              </ol>
            </>
          )}
        </section>

        <section className="mt-12 space-y-4 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Privacy</h2>
          <p>
            The scan runs in your browser. We do not receive the page HTML, cookies, or your
            browsing history. If you click through to the diagnostic, that visit is covered by our{" "}
            <Link href="/privacy" className="text-brand-600 hover:underline">
              privacy policy
            </Link>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
