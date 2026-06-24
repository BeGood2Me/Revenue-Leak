import type { BusinessType } from "@/lib/types";
import { BUSINESS_TYPE_DESCRIPTIONS, BUSINESS_TYPE_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";

const BUSINESS_TYPES: BusinessType[] = ["saas", "ecommerce", "agency", "service"];

const ICONS: Record<BusinessType, string> = {
  saas: "☁️",
  ecommerce: "🛒",
  agency: "🎯",
  service: "🔧",
};

interface BusinessTypeSelectorProps {
  selected: BusinessType | null;
  onSelect: (type: BusinessType) => void;
}

export function BusinessTypeSelector({ selected, onSelect }: BusinessTypeSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {BUSINESS_TYPES.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onSelect(type)}
          className={cn(
            "rounded-xl border-2 p-4 text-left transition-all hover:border-brand-300 hover:shadow-sm",
            selected === type
              ? "border-brand-600 bg-brand-50 ring-2 ring-brand-600/20"
              : "border-slate-200 bg-white"
          )}
        >
          <span className="text-2xl">{ICONS[type]}</span>
          <h3 className="mt-2 font-semibold text-slate-900">
            {BUSINESS_TYPE_LABELS[type]}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {BUSINESS_TYPE_DESCRIPTIONS[type]}
          </p>
        </button>
      ))}
    </div>
  );
}
