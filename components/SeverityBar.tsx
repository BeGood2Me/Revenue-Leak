import { getSeverityLabel } from "@/lib/scoring";
import type { LeakCategory } from "@/lib/types";
import { LEAK_CATEGORY_LABELS } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

interface SeverityBarProps {
  category: LeakCategory;
  severity: number;
  showAmount?: boolean;
  amount?: number;
  blurred?: boolean;
}

export function SeverityBar({
  category,
  severity,
  showAmount = false,
  amount = 0,
  blurred = false,
}: SeverityBarProps) {
  const label = getSeverityLabel(severity);

  const barColor =
    severity < 35
      ? "bg-emerald-500"
      : severity < 65
        ? "bg-amber-500"
        : "bg-red-500";

  const badgeColor =
    severity < 35
      ? "bg-emerald-100 text-emerald-800"
      : severity < 65
        ? "bg-amber-100 text-amber-800"
        : "bg-red-100 text-red-800";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-medium text-slate-900">{LEAK_CATEGORY_LABELS[category]}</h4>
          <span className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium", badgeColor)}>
            {label} risk · {severity}/100
          </span>
        </div>
        {showAmount && (
          <div className={cn("text-right", blurred && "select-none")}>
            {blurred ? (
              <>
                <p className="text-lg font-bold text-slate-900 blur-md" aria-hidden="true">
                  {formatCurrency(amount)}
                </p>
                <p className="sr-only">Amount locked — unlock full report to see</p>
              </>
            ) : (
              <p className="text-lg font-bold text-slate-900">{formatCurrency(amount)}</p>
            )}
            <p className="text-xs text-slate-500">/month est.</p>
          </div>
        )}
      </div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${severity}%` }}
        />
      </div>
    </div>
  );
}
