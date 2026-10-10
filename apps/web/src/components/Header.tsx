"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { useAppState } from "@/components/AppState";
import { arcMainnet, arcTestnet, TYPICAL_FEE_USD } from "@/config/chains";
import { shortAddress } from "@/lib/format";
import { LINKS, ROUTES } from "@/lib/marketing/site";

export function Header() {
  const { network, setNetwork, demo } = useAppState();
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const pathname = usePathname();

  const targetChain = network === "mainnet" ? arcMainnet : arcTestnet;

  // Marketing pages (/ and /lp/*) render their own BrandHeader with no wallet UI.
  if (pathname === "/" || pathname?.startsWith("/lp/")) return null;

  const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-arc-400";
  const item = `rounded-md px-2.5 py-1.5 hover:bg-white/5 hover:text-white ${focus}`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/" className={`shrink-0 rounded-md ${focus}`}>
            <Image src="/brand/agenttill-lockup-transparent.svg" alt="AgentTill" width={132} height={50} priority unoptimized />
          </Link>
          <nav aria-label="Primary" className="flex items-center overflow-x-auto text-sm text-slate-400">
            <Link href="/" className={item}>Home</Link>
            <Link href={ROUTES.judges} className={item}>Judges</Link>
            <Link href={ROUTES.developers} className={item}>Developers</Link>
            <a href={LINKS.repo} target="_blank" rel="noreferrer" className={item}>GitHub</a>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {demo && (
            <span className="hidden rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300 sm:inline">
              Demo mode
            </span>
          )}
          <div role="group" aria-label="Network" className="flex rounded-lg border border-white/10 bg-ink-900 p-0.5 text-xs">
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
    </header>
  );
}
