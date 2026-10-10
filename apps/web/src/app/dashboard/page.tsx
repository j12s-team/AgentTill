"use client";

import { useAppState } from "@/components/AppState";
import { StatCard } from "@/components/StatCard";
import { AgentCard } from "@/components/AgentCard";
import { Ledger } from "@/components/Ledger";
import { SpendConsole } from "@/components/SpendConsole";
import { OwnerControls } from "@/components/OwnerControls";
import { TillAddressBar } from "@/components/TillAddressBar";
import { AddressRow } from "@/components/marketing/AddressRow";
import { TYPICAL_FEE_USD } from "@/config/chains";

const usd = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function DashboardPage() {
  const { network, demo, demoState, tillAddress } = useAppState();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const spentToday = demoState.payments
    .filter((p) => p.ts >= startOfDay.getTime())
    .reduce((sum, p) => sum + p.amount, 0);
  const remainingToday = Math.max(0, demoState.dailyCap - spentToday);
  const agents = demoState.agents.filter((a) => a.registered);
  const networkLabel = network === "mainnet" ? "Arc Mainnet · 5042" : "Arc Testnet · 5042002";

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-6 md:py-12">
      <section aria-labelledby="dash-h1">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-arc-300">Operator console</p>
            <h1 id="dash-h1" className="mt-1 text-[32px] font-semibold leading-[38px] tracking-tight text-white">
              Till dashboard
            </h1>
            <p className="mt-2 max-w-xl text-base text-slate-300">
              {demo
                ? "Demo mode — set NEXT_PUBLIC_AGENT_TILL_ADDRESS or paste a till below to go onchain."
                : "Policy-bound USDC till. Every agent spend is checked onchain before it executes."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-arc-500/30 bg-arc-500/10 px-2.5 py-1 font-medium text-arc-200">
              {networkLabel}
            </span>
            {demo ? (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-medium text-amber-300">
                Demo mode
              </span>
            ) : (
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-medium text-emerald-300">
                Onchain
              </span>
            )}
            <span className="rounded-full border border-white/10 bg-ink-900 px-2.5 py-1 text-slate-300">
              Typical fee {TYPICAL_FEE_USD}
            </span>
          </div>
        </div>
        <div className="mt-5 max-w-2xl">
          <AddressRow network={network} address={tillAddress ?? null} page="dashboard" />
        </div>
      </section>

      <section aria-label="Till stats" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Budget" value={usd(demoState.budget)} hint="USDC ERC-20 (6 decimals)" accent="blue" />
        <StatCard
          label="Remaining today"
          value={usd(remainingToday)}
          hint={`Daily cap ${usd(demoState.dailyCap)}`}
          accent={remainingToday === 0 ? "rose" : remainingToday < demoState.dailyCap * 0.2 ? "amber" : "green"}
        />
        <StatCard
          label="Spent"
          value={usd(demoState.sessionSpent)}
          hint={demoState.sessionCap ? `Session cap ${usd(demoState.sessionCap)}` : "No session cap"}
          accent="green"
        />
        <StatCard
          label="Agents"
          value={String(agents.length)}
          hint={demoState.paused ? "Till paused" : `Active · ${demoState.payments.length} payments`}
          accent={demoState.paused ? "amber" : "blue"}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <SpendConsole />
        <OwnerControls />
      </div>

      <TillAddressBar />

      <section aria-labelledby="agents-h">
        <h2 id="agents-h" className="mb-4 text-2xl font-semibold tracking-tight text-white">Agents</h2>
        {agents.length === 0 ? (
          <p className="rounded-2xl border border-white/5 bg-ink-900 p-5 text-sm text-slate-400">No registered agents yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((a) => (
              <AgentCard
                key={a.address}
                name={a.name}
                address={a.address}
                spent={a.spent}
                remainingHint={`Max $${demoState.maxPerPayment}/pay`}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <Ledger payments={demoState.payments} network={network} />
      </section>
    </div>
  );
}
