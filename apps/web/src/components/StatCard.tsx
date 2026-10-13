export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: "blue" | "green" | "amber" | "rose";
}) {
  const dot =
    accent === "green"
      ? "bg-emerald-400"
      : accent === "amber"
        ? "bg-amber-400"
        : accent === "rose"
          ? "bg-rose-400"
          : "bg-arc-400";

  return (
    <div className="rounded-2xl border border-white/5 bg-ink-900 p-5">
      <p className="flex items-center gap-2 text-sm font-medium text-slate-400">
        <span aria-hidden="true" className={`inline-block h-2 w-2 rounded-full ${dot}`} />
        {label}
      </p>
      <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-white">{value}</p>
      {hint ? <p className="mt-1 text-sm text-slate-400">{hint}</p> : null}
    </div>
  );
}
