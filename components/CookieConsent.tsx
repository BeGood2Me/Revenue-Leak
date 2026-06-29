"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";
import { isAnalyticsConfigured } from "@/lib/analytics-config";
import {
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentStatus,
} from "@/lib/cookie-consent";

export function CookieConsent() {
  const [consent, setConsent] = useState<CookieConsentStatus | null | "loading">("loading");

  useEffect(() => {
    setConsent(readCookieConsent());
  }, []);

  if (!isAnalyticsConfigured()) return null;
  if (consent === "loading") return null;

  function handleChoice(status: CookieConsentStatus) {
    writeCookieConsent(status);
    setConsent(status);
  }

  return (
    <>
      {consent === "accepted" ? <AnalyticsScripts /> : null}
      {consent === null ? (
        <div
          className="fixed inset-x-0 bottom-0 z-[100] border-t border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:p-5"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-slate-600">
              We use analytics cookies (Google Analytics and/or Meta Pixel) to measure traffic and
              ad performance. See our{" "}
              <Link href="/privacy" className="text-brand-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleChoice("declined")}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Essential only
              </button>
              <button
                type="button"
                onClick={() => handleChoice("accepted")}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                Accept analytics
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
