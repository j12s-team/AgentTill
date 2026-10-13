import { formatUsdc, shortAddress } from "@/lib/format";

export function AgentCard({
  name,
  address,
  spent,
  remainingHint,
}: {
  name: string;
  address: string;
  spent: number | bigint;
  remainingHint?: string;
}) {
  const spentLabel =
    typeof spent === "bigint" ? formatUsdc(spent) : formatUsdc(BigInt(Math.round(spent * 1e6)));

  return (
    <div className="rounded-2xl border border-white/5 bg-ink-900 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="mt-1 font-mono text-xs text-slate-400">{shortAddress(address, 6)}</p>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300">
          Active
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-slate-400">Lifetime spent</p>
          <p className="font-mono text-slate-200">${spentLabel}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Policy</p>
          <p className="text-slate-200">{remainingHint ?? "Within till policy"}</p>
        </div>
      </div>
    </div>
  );
}
