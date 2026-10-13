"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BaseError, ContractFunctionRevertedError, createPublicClient, formatUnits, http, parseUnits, type Address } from "viem";
import { arcTestnet, explorerTxUrl } from "@/config/chains";
import { shortAddress } from "@/lib/format";
import { track } from "@/lib/analytics";
import { tillDemoAbi } from "@/lib/marketing/till-abi";
import { TESTNET_TILL } from "@/lib/marketing/site";
import { START_DEMO_EVENT } from "./PrimaryCTA";

type Policy = { maxPerPayment: bigint; dailyCap: bigint; sessionCap: bigint; allowlistEnabled: boolean; memoRequired: boolean };
type LedgerRow = { id: string; amount: bigint; payee: Address; reason: string; remaining: bigint; tx?: `0x${string}` };
type Live = {
  source: "live" | "fixture";
  policy: Policy;
  budget: bigint;
  paused: boolean;
  dailySpent: bigint;
  agent: Address | null;
  ledger: LedgerRow[];
  sim: Record<number, string>;
};

const U = (n: string) => parseUnits(n, 6);
const fmt = (v: bigint) => `${Number(formatUnits(v, 6)).toLocaleString("en-US", { maximumFractionDigits: 2 })} USDC`;
const UNKNOWN: Address = "0x000000000000000000000000000000000000dEaD";

/** Fixture = the default policy in packages/contracts/script/Deploy.s.sol. */
const FIXTURE: Live = {
  source: "fixture",
  policy: { maxPerPayment: U("100"), dailyCap: U("500"), sessionCap: U("5000"), allowlistEnabled: false, memoRequired: true },
  budget: U("1000"),
  paused: false,
  dailySpent: 0n,
  agent: null,
  ledger: [],
  sim: {},
};

type Step = { call: string; check: string; ok: boolean; chip: string; scenario?: string };

function buildSteps(p: Policy): Step[] {
  const max = p.maxPerPayment === 0n ? U("100") : p.maxPerPayment;
  const cap = p.dailyCap === 0n ? U("500") : p.dailyCap;
  const near = cap - U("20");
  return [
    { call: `spend(5 USDC, allowlisted API, "inference credits")`, check: "registered · memo set · ≤ maxPerPayment · ≤ budget · ≤ dailyCap · payee allowed", ok: true, chip: "Executed" },
    { call: `spend(${fmt(max + U("1"))}, allowlisted API, "bulk")`, check: `amount > maxPerPayment (${fmt(max)})`, ok: false, chip: "Rejected · ExceedsMaxPerPayment()" },
    { call: `spend(50 USDC, allowlisted API, "batch")`, check: `dailySpent ${fmt(near)} + 50 > dailyCap ${fmt(cap)}`, ok: false, chip: "Rejected · ExceedsDailyCap()", scenario: `Scenario: ${fmt(near)} already spent today` },
    { call: `spend(1 USDC, ${shortAddress(UNKNOWN)}, "tip")`, check: "allowlistEnabled = true and payee not listed", ok: false, chip: "Rejected · PayeeNotAllowed()", scenario: p.allowlistEnabled ? undefined : "Scenario: owner turns the allowlist on (live till has it off)" },
    { call: `owner pause() → spend(1 USDC, …)`, check: "whenNotPaused modifier runs before any policy check", ok: false, chip: "Blocked · EnforcedPause()", scenario: "Scenario: owner has paused the till (OpenZeppelin Pausable)" },
  ];
}

function decode(e: unknown): string {
  if (e instanceof BaseError) {
    const r = e.walk((x) => x instanceof ContractFunctionRevertedError);
    if (r instanceof ContractFunctionRevertedError) return r.data?.errorName ? `${r.data.errorName}()` : r.shortMessage;
    return e.shortMessage;
  }
  return "reverted";
}

async function loadLive(): Promise<Live> {
  const client = createPublicClient({ chain: arcTestnet, transport: http(undefined, { timeout: 8000 }) });
  const base = { address: TESTNET_TILL, abi: tillDemoAbi } as const;
  const [policy, budget, paused, dailySpent, agents] = await Promise.all([
    client.readContract({ ...base, functionName: "getPolicy" }),
    client.readContract({ ...base, functionName: "remainingBudget" }),
    client.readContract({ ...base, functionName: "paused" }),
    client.readContract({ ...base, functionName: "dailySpent" }),
    client.readContract({ ...base, functionName: "getAgents" }),
  ]);

  let ledger: LedgerRow[] = [];
  try {
    const latest = await client.getBlockNumber();
    const logs = await client.getContractEvents({ ...base, eventName: "PaymentExecuted", fromBlock: latest > 9_999n ? latest - 9_999n : 0n, toBlock: latest });
    ledger = logs.slice(-8).reverse().map((l) => ({
      id: String(l.args.paymentId),
      amount: l.args.amount ?? 0n,
      payee: l.args.payee as Address,
      reason: l.args.reason ?? "",
      remaining: l.args.remainingBudget ?? 0n,
      tx: l.transactionHash ?? undefined,
    }));
  } catch {
    /* range-limited RPC: ledger stays empty */
  }

  const agent = agents[0] ?? null;
  const sim: Record<number, string> = {};
  if (agent && !paused) {
    const payee = ledger[0]?.payee ?? agent;
    const max = policy.maxPerPayment;
    const probes: [number, bigint][] = [[0, U("5")]];
    if (max > 0n) probes.push([1, max + U("1")]);
    await Promise.all(
      probes.map(async ([i, amount]) => {
        try {
          await client.simulateContract({ ...base, functionName: "spend", args: [amount, payee, "agenttill demo simulation"], account: agent });
          sim[i] = "Simulation passed (no tx sent)";
        } catch (e) {
          sim[i] = `Simulation reverted: ${decode(e)}`;
        }
      }),
    );
  }

  return { source: "live", policy: { ...policy }, budget, paused, dailySpent, agent, ledger, sim };
}

export function FirewallDemo() {
  const [data, setData] = useState<Live>(FIXTURE);
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const done = useRef(false);
  const steps = buildSteps(data.policy);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    let alive = true;
    loadLive().then((d) => alive && setData(d)).catch(() => alive && setData(FIXTURE));
    return () => {
      alive = false;
      mq.removeEventListener("change", on);
    };
  }, []);

  const go = useCallback(
    (next: number) => {
      const i = Math.min(next, steps.length - 1);
      setStep(i);
      track("demo_step_view", { step: i + 1, result: steps[i].ok ? "executed" : "rejected" });
      if (i === steps.length - 1) {
        setPlaying(false);
        if (!done.current) {
          done.current = true;
          track("demo_completed");
        }
      }
    },
    [steps],
  );

  useEffect(() => {
    const start = () => {
      if (reduced) go(0);
      else {
        go(0);
        setPlaying(true);
      }
    };
    window.addEventListener(START_DEMO_EVENT, start);
    return () => window.removeEventListener(START_DEMO_EVENT, start);
  }, [go, reduced]);

  useEffect(() => {
    if (!playing || reduced) return;
    const t = window.setTimeout(() => go(step + 1), 4000);
    return () => window.clearTimeout(t);
  }, [playing, reduced, step, go]);

  function togglePlay() {
    if (playing) {
      setPlaying(false);
      return;
    }
    go(step >= steps.length - 1 ? 0 : step + 1);
    setPlaying(!reduced);
  }

  const current = step >= 0 ? steps[step] : null;
  const p = data.policy;
  const btn = "rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-arc-400 disabled:opacity-40";

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
      <div className="rounded-2xl border border-white/10 bg-ink-900 p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-white">Policy on the till</h3>
          <span className={`rounded-full px-2 py-0.5 text-xs ${data.source === "live" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-500/10 text-amber-300"}`}>
            {data.source === "live" ? "● Live · Arc Testnet" : "◷ Fixture (RPC unavailable)"}
          </span>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs">
          {[
            ["maxPerPayment", p.maxPerPayment === 0n ? "unlimited" : fmt(p.maxPerPayment)],
            ["dailyCap", p.dailyCap === 0n ? "unlimited" : fmt(p.dailyCap)],
            ["sessionCap", p.sessionCap === 0n ? "unlimited" : fmt(p.sessionCap)],
            ["allowlistEnabled", String(p.allowlistEnabled)],
            ["memoRequired", String(p.memoRequired)],
            ["remainingBudget", fmt(data.budget)],
            ["dailySpent", fmt(data.dailySpent)],
            ["paused", String(data.paused)],
          ].map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-slate-400">{k}</dt>
              <dd className="text-right text-slate-100">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-slate-400">Read-only via public RPC. No wallet, no writes.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink-900 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={btn} onClick={togglePlay}>
            {playing ? "Pause" : step >= steps.length - 1 ? "Replay" : "Play"}
          </button>
          <button type="button" className={btn} onClick={() => { setPlaying(false); go(step + 1); }} disabled={step >= steps.length - 1}>
            Step
          </button>
          <span className="ml-auto text-xs text-slate-400">{reduced ? "Reduced motion: step manually" : "Auto-advances every 4s"}</span>
        </div>

        <ol className="mt-4 space-y-2">
          {steps.map((s, i) => {
            const state = i === step ? "current" : i < step ? "past" : "future";
            return (
              <li key={i} aria-current={state === "current" ? "step" : undefined} className={`rounded-lg border px-3 py-2 ${state === "current" ? "border-arc-400/60 bg-ink-800" : "border-white/5"} ${state === "future" ? "opacity-60" : ""}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <code className="font-mono text-xs text-slate-100">{i + 1}. {s.call}</code>
                  {state !== "future" && (
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${s.ok ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-rose-400"}`}>
                      <span aria-hidden="true">{s.ok ? "✓" : "✕"}</span>
                      {s.chip}
                    </span>
                  )}
                </div>
                {state === "current" && (
                  <div className="mt-1 space-y-0.5 text-xs text-slate-400">
                    <p>Check: {s.check}</p>
                    {s.scenario && <p className="text-amber-300">{s.scenario}</p>}
                    {data.sim[i] && <p className="text-arc-300">Simulated against live testnet contract — {data.sim[i]}</p>}
                    {i === 0 && data.ledger[0]?.tx && (
                      <p>
                        Real recent <code className="font-mono">PaymentExecuted</code>:{" "}
                        <a className="text-arc-300 underline" href={explorerTxUrl("testnet", data.ledger[0].tx)} target="_blank" rel="noreferrer">
                          #{data.ledger[0].id} · {fmt(data.ledger[0].amount)} ↗
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
        <p role="status" aria-live="polite" className="sr-only">
          {current ? `Step ${step + 1}: ${current.call}. ${current.chip}.` : ""}
        </p>
        <p className="mt-4 text-sm text-slate-300">Rejections are reverts — no USDC moves, the agent just gets an error.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink-900 lg:col-span-2">
        <h3 className="border-b border-white/5 px-5 py-3 font-semibold text-white">PaymentExecuted ledger (testnet)</h3>
        {data.ledger.length === 0 ? (
          <p className="px-5 py-4 text-sm text-slate-400">
            {data.source === "live" ? "No PaymentExecuted events in the last ~10k blocks." : "Live ledger unavailable — RPC unreachable. No sample rows are shown, so nothing here is invented."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left font-mono text-xs">
              <thead className="text-slate-400">
                <tr>{["#", "Amount", "Payee", "Reason", "Remaining", "Tx"].map((h) => <th key={h} scope="col" className="px-5 py-2 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody className="text-slate-300">
                {data.ledger.map((r) => (
                  <tr key={r.id} className="border-t border-white/5">
                    <td className="px-5 py-2">{r.id}</td>
                    <td className="px-5 py-2 text-emerald-300">{fmt(r.amount)}</td>
                    <td className="px-5 py-2" title={r.payee}>{shortAddress(r.payee)}</td>
                    <td className="max-w-[16rem] truncate px-5 py-2 font-sans" title={r.reason}>{r.reason}</td>
                    <td className="px-5 py-2">{fmt(r.remaining)}</td>
                    <td className="px-5 py-2">{r.tx && <a className="text-arc-300 underline" href={explorerTxUrl("testnet", r.tx)} target="_blank" rel="noreferrer">{shortAddress(r.tx)} ↗</a>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
