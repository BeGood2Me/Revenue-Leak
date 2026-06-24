import type { LeakInsight } from "@/lib/types";

import { LEAK_CATEGORY_LABELS } from "@/lib/types";

import { getSeverityLabel } from "@/lib/scoring";

import { effortLabel } from "@/lib/action-plan";

import { formatCurrency } from "@/lib/utils";



interface LeakCardProps {

  leak: LeakInsight;

  rank?: number;

  showDetails?: boolean;

}



export function LeakCard({ leak, rank, showDetails = true }: LeakCardProps) {

  const severityLabel = getSeverityLabel(leak.severity);



  return (

    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-start gap-4">

        {rank !== undefined && (

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">

            {rank}

          </div>

        )}

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <h3 className="text-lg font-semibold text-slate-900">

              {LEAK_CATEGORY_LABELS[leak.category]}

            </h3>

            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">

              {severityLabel} · {leak.severity}/100

            </span>

          </div>

          {showDetails && (

            <>

              <p className="mt-2 text-2xl font-bold text-red-600">

                {formatCurrency(leak.estimatedMonthlyLoss)}

                <span className="text-sm font-normal text-slate-500"> /month estimated loss</span>

              </p>

              {leak.benchmarkHint && (

                <p className="mt-2 text-xs font-medium text-brand-600">{leak.benchmarkHint}</p>

              )}

              <p className="mt-4 text-slate-700 leading-relaxed">{leak.explanation}</p>

              <div className="mt-4">

                <h4 className="text-sm font-semibold text-slate-900">Fix first:</h4>

                <ul className="mt-2 space-y-2">

                  {leak.recommendations.map((item, i) => (

                    <li key={i} className="flex gap-2 text-sm text-slate-700">

                      <span className="mt-0.5 text-brand-600">→</span>

                      <span className="flex-1">

                        <span className="mr-2 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">

                          {effortLabel(item.effort)}

                        </span>

                        {item.text}

                      </span>

                    </li>

                  ))}

                </ul>

              </div>

            </>

          )}

        </div>

      </div>

    </article>

  );

}


