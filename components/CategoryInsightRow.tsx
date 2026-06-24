"use client";

import { useState } from "react";
import type { LeakInsight } from "@/lib/types";
import { LEAK_CATEGORY_LABELS } from "@/lib/types";
import { getSeverityLabel } from "@/lib/scoring";
import { formatCurrency, cn } from "@/lib/utils";

interface CategoryInsightRowProps {
  leak: LeakInsight;
}

export function CategoryInsightRow({ leak }: CategoryInsightRowProps) {
  const [expanded, setExpanded] = useState(false);
  const severityLabel = getSeverityLabel(leak.severity);
  const barColor =
    leak.severity < 35 ? "bg-emerald-500" : leak.severity < 65 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-medium text-slate-900">{LEAK_CATEGORY_LABELS[leak.category]}</h4>
          <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {severityLabel} risk · {leak.severity}/100
          </span>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-900">{formatCurrency(leak.estimatedMonthlyLoss)}</p>
          <p className="text-xs text-slate-500">/month est.</p>
        </div>
      </div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className={cn("h-full rounded-full", barColor)} style={{ width: `${leak.severity}%` }} />
      </div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        {expanded ? "Hide details" : "Show why this matters"}
      </button>
      {expanded && (
        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
          <p className="text-sm text-slate-700 leading-relaxed">{leak.explanation}</p>
          {leak.benchmarkHint && (
            <p className="text-xs font-medium text-brand-600">{leak.benchmarkHint}</p>
          )}
        </div>
      )}
    </div>
  );
}
