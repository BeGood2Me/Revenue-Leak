export function WizardSkeleton() {
  return (
    <div
      className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
      aria-busy="true"
      aria-label="Loading diagnostic"
    >
      <div className="h-6 w-48 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-full max-w-md rounded bg-slate-100" />
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-slate-100 p-4">
            <div className="h-8 w-8 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-24 rounded bg-slate-200" />
            <div className="mt-2 h-3 w-full rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
