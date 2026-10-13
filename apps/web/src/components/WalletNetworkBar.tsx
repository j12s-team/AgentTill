"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { useAppState } from "@/components/AppState";
import { arcMainnet, arcTestnet, TYPICAL_FEE_USD } from "@/config/chains";
import { shortAddress } from "@/lib/format";

/** Network toggle + wallet control, moved verbatim from the old Header.tsx. */
export function WalletNetworkBar() {
  const { network, setNetwork, demo } = useAppState();
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const targetChain = network === "mainnet" ? arcMainnet : arcTestnet;

  const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-arc-400";

  return (
    <div
      role="region"
      aria-label="Network & wallet"
      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-ink-900 px-3 py-2.5"
    >
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Network &amp; wallet</span>
    <div className="flex flex-wrap items-center gap-2">
      {demo && (
        <span className="hidden rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300 sm:inline">
          Demo mode
        </span>
      )}
      <div role="group" aria-label="Network" className="flex rounded-lg border border-white/10 bg-ink-950 p-0.5 text-xs">
        <button
          type="button"
          onClick={() => {
            setNetwork("testnet");
            switchChain?.({ chainId: arcTestnet.id });
          }}
          className={`rounded-md px-2.5 py-1.5 transition ${focus} ${
            network === "testnet" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          Testnet
        </button>
        <button
          type="button"
          onClick={() => {
            setNetwork("mainnet");
            switchChain?.({ chainId: arcMainnet.id });
          }}
          className={`rounded-md px-2.5 py-1.5 transition ${focus} ${
            network === "mainnet" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          Mainnet
        </button>
      </div>

      {isConnected && address ? (
        <div className="flex items-center gap-2">
          {chain && chain.id !== targetChain.id && (
            <button
              type="button"
              onClick={() => switchChain?.({ chainId: targetChain.id })}
              className={`rounded-lg border border-rose-500/40 bg-rose-500/10 px-2.5 py-1.5 text-xs text-rose-300 ${focus}`}
            >
              Switch to Arc
            </button>
          )}
          <button
            type="button"
            onClick={() => disconnect()}
            className={`rounded-lg border border-white/10 bg-ink-800 px-3 py-1.5 font-mono text-xs text-slate-200 hover:bg-ink-700 ${focus}`}
            title={`Fees typically ${TYPICAL_FEE_USD} on Arc`}
          >
            {shortAddress(address)}
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            const c = connectors.find((x) => x.id === "injected") ?? connectors[0];
            if (c) connect({ connector: c, chainId: targetChain.id });
          }}
          className={`whitespace-nowrap rounded-lg bg-arc-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-arc-500 disabled:opacity-50 ${focus}`}
        >
          {isPending ? "Connecting…" : "Connect wallet"}
        </button>
      )}
    </div>
    </div>
  );
}
