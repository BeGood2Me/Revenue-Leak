"use client";

import { useState } from "react";
import Link from "next/link";
import { FAQ_ITEMS } from "@/lib/faq";
import { LEAK_CATEGORIES, LEAK_CATEGORY_LABELS } from "@/lib/types";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="border-t border-surface-muted bg-surface-raised/80 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-center font-display text-2xl font-semibold text-ink">
          Common questions
        </h2>
        <div className="mt-8 divide-y divide-surface-muted rounded-xl border border-surface-muted bg-surface">
          {FAQ_ITEMS.map((item, i) => (
            <div key={item.q}>
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-ink hover:bg-surface-raised"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                {item.q}
                <span className="ml-4 text-ink-soft">{openIndex === i ? "−" : "+"}</span>
              </button>
              {openIndex === i && (
                <p className="px-5 pb-4 text-sm leading-relaxed text-ink-muted">{item.a}</p>
              )}
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-ink-soft">
          7-day refund policy and how we handle your data:{" "}
          <Link href="/terms" className="text-brand-700 hover:underline">
            Terms of Service
          </Link>
          {" · "}
          <Link href="/privacy" className="text-brand-700 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </section>
  );
}

export function CredibilityBand() {
  return (
    <div className="mt-12 border-t border-surface-muted pt-10">
      <p className="text-center text-sm font-medium text-ink-soft">
        Built for founders across SaaS, ecommerce, agencies, and local services
      </p>
      <h2 className="mt-6 text-center font-display text-lg font-semibold text-ink">
        We scan 6 universal leak categories
      </h2>
      <ul className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-ink-muted">
        {LEAK_CATEGORIES.map((cat, i) => (
          <li key={cat} className="inline-flex items-center gap-4">
            {i > 0 ? (
              <span className="text-surface-muted" aria-hidden="true">
                ·
              </span>
            ) : null}
            <span className="font-medium text-ink">{LEAK_CATEGORY_LABELS[cat]}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-center text-sm text-ink-muted">
        See a sample for{" "}
        <Link href="/sample-report?niche=saas" className="text-brand-700 hover:underline">
          SaaS
        </Link>
        {", "}
        <Link href="/sample-report?niche=ecommerce" className="text-brand-700 hover:underline">
          ecommerce
        </Link>
        {", "}
        <Link href="/sample-report?niche=agencies" className="text-brand-700 hover:underline">
          agencies
        </Link>
        {", or "}
        <Link href="/sample-report?niche=local-services" className="text-brand-700 hover:underline">
          local services
        </Link>
        .{" "}
        <Link href="/about#methodology" className="text-brand-700 hover:underline">
          How the score works
        </Link>
      </p>
    </div>
  );
}
