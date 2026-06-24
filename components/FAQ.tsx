"use client";

import { useState } from "react";
import { LEAK_CATEGORIES, LEAK_CATEGORY_LABELS } from "@/lib/types";

const FAQ_ITEMS = [
  {
    q: "How accurate is this?",
    a: "It's a directional diagnostic based on your answers and industry benchmarks — not a financial audit. Benchmarks are directional ranges from common SaaS, ecommerce, agency, and service industry reports. The goal is to show you where to look first and estimate rough monthly impact so you can prioritize fixes.",
  },
  {
    q: "What do I get when I unlock the full report?",
    a: "Executive summary with funnel health score, your top 3 leaks ranked by dollar impact, effort-tagged fix-first recommendations, a 30-day action plan, and expandable breakdowns for all 6 leak categories.",
  },
  {
    q: "How fast do I get access?",
    a: "Instantly. After payment you'll see your full report on-screen and receive an email with a permanent link you can return to anytime.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes — if the report doesn't give you actionable clarity on where your business is leaking revenue, contact us within 7 days for a full refund.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="border-t border-slate-200 bg-white py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-slate-900">
          Common questions
        </h2>
        <div className="mt-8 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-slate-50">
          {FAQ_ITEMS.map((item, i) => (
            <div key={item.q}>
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-slate-900 hover:bg-white"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                {item.q}
                <span className="ml-4 text-slate-400">{openIndex === i ? "−" : "+"}</span>
              </button>
              {openIndex === i && (
                <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CredibilityBand() {
  return (
    <div className="mt-12 border-t border-slate-200 pt-10">
      <p className="text-center text-sm font-medium text-slate-500">
        Built for founders across SaaS, ecommerce, agencies, and local services
      </p>
      <h2 className="mt-6 text-center text-lg font-semibold text-slate-900">
        We scan 6 universal leak categories
      </h2>
      <div className="mx-auto mt-4 grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LEAK_CATEGORIES.map((cat) => (
          <div
            key={cat}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
          >
            <span className="font-medium text-slate-900">{LEAK_CATEGORY_LABELS[cat]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
