"use client";

import { explorerTxUrl, TYPICAL_FEE_USD, type NetworkId } from "@/config/chains";
import { formatUsdc, shortAddress } from "@/lib/format";
import type { DemoPayment } from "@/lib/demo-store";

export function Ledger({
  payments,
  network,
}: {
  payments: DemoPayment[];
  network: NetworkId;
}) {
  return (
    <div id="ledger" className="scroll-mt-20 rounded-2xl border border-white/5 bg-ink-900">
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white">Payment ledger</h2>
          <p className="mt-0.5 text-sm text-slate-400">
            Arc fees typically {TYPICAL_FEE_USD} — never shown as Gwei/ETH
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-slate-400">
            <tr className="border-b border-white/5">
              <th className="px-5 py-3 font-medium">ID</th>
              <th className="px-5 py-3 font-medium">Agent</th>
              <th className="px-5 py-3 font-medium">Payee</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Reason</th>
              <th className="px-5 py-3 font-medium">Fee</th>
              <th className="px-5 py-3 font-medium">Tx</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-slate-500">
                  No payments yet. Run a spend from the console.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="px-5 py-3 font-mono text-slate-400">#{p.id}</td>
                  <td className="px-5 py-3">
                    <div className="text-slate-200">{p.agentName}</div>
                    <div className="font-mono text-xs text-slate-500">{shortAddress(p.agent)}</div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-300">
                    {shortAddress(p.payee, 5)}
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300">
                      Executed
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-slate-100">
                    ${formatUsdc(BigInt(Math.round(p.amount * 1e6)))}
                  </td>
                  <td className="max-w-[200px] truncate px-5 py-3 text-slate-400">{p.reason}</td>
                  <td className="px-5 py-3 text-slate-400">{TYPICAL_FEE_USD}</td>
                  <td className="px-5 py-3">
                    <a
                      href={explorerTxUrl(network, p.hash)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded text-arc-300 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-arc-400"
                      aria-label={`View payment #${p.id} on explorer`}
                    >
                      Explorer ↗
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
