import type { Question, Answers } from "@/lib/types";
import { NOT_SURE_VALUE } from "@/lib/types";
import { NOT_SURE_OPTION } from "@/lib/questions/shared";
import { cn, parseFormattedNumber } from "@/lib/utils";

interface QuestionFieldProps {
  question: Question;
  value: string | number | boolean | undefined;
  onChange: (id: string, value: string | number | boolean) => void;
  error?: string;
}

function OptionButtons({
  question,
  value,
  onChange,
  options,
}: {
  question: Question;
  value: string | number | boolean | undefined;
  onChange: QuestionFieldProps["onChange"];
  options: NonNullable<Question["options"]>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(question.id, opt.value)}
          className={cn(
            "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
            String(value) === opt.value
              ? "border-brand-600 bg-brand-50 text-brand-700"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function QuestionField({ question, value, onChange, error }: QuestionFieldProps) {
  const id = `q-${question.id}`;

  if (question.type === "band") {
    return (
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-slate-900">
          {question.label}
          {question.required !== false && <span className="text-red-500"> *</span>}
        </legend>
        {question.helpText && (
          <p className="text-sm text-slate-500">{question.helpText}</p>
        )}
        <OptionButtons
          question={question}
          value={value}
          onChange={onChange}
          options={
            question.bands?.map((b) => ({
              value: b.value,
              label: b.label,
              riskScore: 0,
            })) ?? []
          }
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </fieldset>
    );
  }

  if (question.type === "yesno" || question.type === "select") {
    return (
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-slate-900">
          {question.label}
          {question.required !== false && <span className="text-red-500"> *</span>}
        </legend>
        {question.helpText && (
          <p className="text-sm text-slate-500">{question.helpText}</p>
        )}
        {question.benchmark && (
          <p className="text-xs font-medium text-brand-600">{question.benchmark}</p>
        )}
        <OptionButtons
          question={question}
          value={value}
          onChange={onChange}
          options={question.options ?? []}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </fieldset>
    );
  }

  const displayValue =
    value === undefined || value === "" || value === NOT_SURE_VALUE
      ? ""
      : typeof value === "number"
        ? value.toLocaleString("en-US")
        : String(value);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-900">
        {question.label}
        {question.required !== false && <span className="text-red-500"> *</span>}
      </label>
      {question.helpText && (
        <p className="text-sm text-slate-500">{question.helpText}</p>
      )}
      {question.benchmark && (
        <p className="text-xs font-medium text-brand-600">{question.benchmark}</p>
      )}
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode={question.type === "percent" ? "decimal" : "numeric"}
          placeholder={question.placeholder}
          value={String(value) === NOT_SURE_VALUE ? "" : displayValue}
          disabled={String(value) === NOT_SURE_VALUE}
          onChange={(e) => {
            const parsed = parseFormattedNumber(e.target.value);
            onChange(question.id, parsed === "" ? "" : parsed);
          }}
          className={cn(
            "w-full rounded-lg border px-4 py-2.5 text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-100 disabled:text-slate-400",
            error ? "border-red-300" : "border-slate-300"
          )}
        />
        {question.type === "percent" && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            %
          </span>
        )}
      </div>
      {question.allowNotSure && (
        <button
          type="button"
          onClick={() => onChange(question.id, NOT_SURE_VALUE)}
          className={cn(
            "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
            String(value) === NOT_SURE_VALUE
              ? "border-brand-600 bg-brand-50 text-brand-700"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
          )}
        >
          {NOT_SURE_OPTION.label}
        </button>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function validateQuestion(question: Question, answers: Answers): string | undefined {
  const raw = answers[question.id];

  if (question.required !== false) {
    if (raw === undefined || raw === null || raw === "") {
      return "This field is required";
    }
  }

  if (raw === NOT_SURE_VALUE) {
    return undefined;
  }

  if (question.type === "number" || question.type === "percent") {
    const num = typeof raw === "number" ? raw : parseFloat(String(raw).replace(/,/g, ""));
    if (Number.isNaN(num)) return "Enter a valid number";
    if (question.min !== undefined && num < question.min) {
      return `Minimum value is ${question.min}`;
    }
    if (question.max !== undefined && num > question.max) {
      return `Maximum value is ${question.max}`;
    }
  }

  return undefined;
}
