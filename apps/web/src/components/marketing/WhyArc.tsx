const COLS = [
  { h: "Problem", b: "AI agents get raw private keys with unbounded spend, and on most chains they must also juggle a second gas token." },
  {
    h: "Solution",
    b: "AgentTill is an onchain policy firewall: the owner deposits USDC and sets maxPerPayment, dailyCap, sessionCap, a payee allowlist, memo requirement, and pause. Agents call spend(amount, payee, reason); anything outside policy reverts.",
  },
  { h: "Why Arc", b: "USDC is the gas token, so every fee and every limit is in dollars. One asset, sub-cent fees, deterministic finality — the right rail for machine payments." },
];

export function WhyArc() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {COLS.map((c) => (
        <div key={c.h} className="rounded-2xl border border-white/5 bg-ink-900 p-5">
          <h3 className="text-lg font-semibold text-white">{c.h}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{c.b}</p>
        </div>
      ))}
    </div>
  );
}
