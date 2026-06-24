import type { LeakInsight, LeakScores } from "@/lib/types";
import { LEAK_CATEGORY_LABELS } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { computeFunnelHealthScore, getHealthScoreLabel } from "@/lib/health-score";
import { buildActionPlan, getQuickWins } from "@/lib/action-plan";
import { getHeroRecommendation } from "@/lib/insights";

interface ReportExecutiveSummaryProps {
  totalEstimatedLoss: number;
  leakScores: LeakScores;
  topLeaks: LeakInsight[];
}

export function ReportExecutiveSummary({
  totalEstimatedLoss,
  leakScores,
  topLeaks,
}: ReportExecutiveSummaryProps) {
  const healthScore = computeFunnelHealthScore(leakScores);
  const healthLabel = getHealthScoreLabel(healthScore);
  const hero = getHeroRecommendation(topLeaks[0]);
  const quickWins = getQuickWins(topLeaks, 3);

  return (
    <section className="mb-10 rounded-2xl border border-brand-200 bg-brand-50 p-6 sm:p-8 print:break-inside-avoid">
      <h2 className="text-xl font-bold text-slate-900">Executive summary</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-4">
          <p className="text-sm text-slate-600">Funnel health score</p>
          <p className="mt-1 text-3xl font-bold text-brand-700">{healthScore}/100</p>
          <p className="text-sm text-slate-600">{healthLabel}</p>
        </div>
        <div className="rounded-xl bg-white p-4">
          <p className="text-sm text-slate-600">Total estimated monthly loss</p>
          <p className="mt-1 text-3xl font-bold text-red-700">{formatCurrency(totalEstimatedLoss)}</p>
        </div>
      </div>
      {hero && topLeaks[0] && (
        <div className="mt-4 rounded-xl bg-white p-4">
          <p className="text-sm font-semibold text-slate-900">
            If you fix only one thing this month
          </p>
          <p className="mt-2 text-slate-700">
            Focus on <strong>{LEAK_CATEGORY_LABELS[topLeaks[0].category]}</strong> — {hero}
          </p>
        </div>
      )}
      {quickWins.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-900">Quick wins (under 1 hour each)</p>
          <ul className="mt-2 space-y-1">
            {quickWins.map((win) => (
              <li key={win} className="flex gap-2 text-sm text-slate-700">
                <span className="text-brand-600">✓</span>
                <span>{win}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

interface ActionPlanSectionProps {
  topLeaks: LeakInsight[];
}

export function ActionPlanSection({ topLeaks }: ActionPlanSectionProps) {
  const plan = buildActionPlan(topLeaks);

  return (
    <section className="mb-12 print:break-inside-avoid">
      <h2 className="mb-4 text-xl font-bold text-slate-900">30-day action plan</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "Week 1 — Quick wins", items: plan.week1 },
          { label: "Week 2 — Build momentum", items: plan.week2 },
          { label: "Week 3 — Deeper fixes", items: plan.week3 },
          { label: "Week 4 — Strategic", items: plan.week4 },
        ].map((week) => (
          <div key={week.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-900">{week.label}</h3>
            <ul className="mt-2 space-y-2">
              {week.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-slate-700">
                  <span className="text-brand-600">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
