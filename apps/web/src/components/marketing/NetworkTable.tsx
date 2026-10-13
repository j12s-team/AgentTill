import Image from "next/image";
import { CopyButton } from "./CopyButton";
import { arcMainnet, arcTestnet, ARC_USDC_ADDRESS } from "@/config/chains";
import { MAINNET_TILL, TESTNET_TILL } from "@/lib/marketing/site";
import { shortAddress } from "@/lib/format";

function Cell({ value, label, mono = true, short = false }: { value: string; label: string; mono?: boolean; short?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={mono ? "font-mono text-slate-100" : ""} title={value}>{short ? shortAddress(value) : value}</span>
      <CopyButton value={value} label={`Copy ${label}`} />
    </span>
  );
}

export function NetworkTable({ page }: { page: string }) {
  const rows: { k: string; m: React.ReactNode; t: React.ReactNode }[] = [
    { k: "Chain ID", m: <Cell value={String(arcMainnet.id)} label="mainnet chain ID" />, t: <Cell value={String(arcTestnet.id)} label="testnet chain ID" /> },
    { k: "RPC", m: <Cell value={arcMainnet.rpcUrls.default.http[0]} label="mainnet RPC URL" />, t: <Cell value={arcTestnet.rpcUrls.default.http[0]} label="testnet RPC URL" /> },
    { k: "Explorer", m: <Cell value={arcMainnet.blockExplorers!.default.url} label="mainnet explorer URL" />, t: <Cell value={arcTestnet.blockExplorers!.default.url} label="testnet explorer URL" /> },
    { k: "USDC (ERC-20, 6 decimals)", m: <Cell value={ARC_USDC_ADDRESS} label="mainnet USDC address" short />, t: <Cell value={ARC_USDC_ADDRESS} label="testnet USDC address" short /> },
    {
      k: "AgentTill",
      m: MAINNET_TILL ? <Cell value={MAINNET_TILL} label="mainnet till address" short /> : <span className="text-slate-300">Deploying — testnet live</span>,
      t: <Cell value={TESTNET_TILL} label="testnet till address" short />,
    },
  ];
  return (
    <div data-page={page}>
      <h2 id="networks" className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-white">
        <Image src="/brand/agenttill-mark.svg" alt="" aria-hidden="true" width={20} height={20} unoptimized />
        Networks
      </h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-ink-900">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">Arc mainnet and testnet configuration</caption>
          <thead className="border-b border-white/10 text-xs text-slate-400">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium"> </th>
              <th scope="col" className="px-4 py-3 font-medium">Arc Mainnet</th>
              <th scope="col" className="px-4 py-3 font-medium">Arc Testnet</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.k} className="border-b border-white/5 last:border-0">
                <th scope="row" className="px-4 py-3 font-medium text-slate-400">{r.k}</th>
                <td className="px-4 py-3">{r.m}</td>
                <td className="px-4 py-3">{r.t}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-slate-400">Gas on Arc is paid in USDC (≈ $0.01/tx). Native gas is an 18-decimal view of the same USDC — the ERC-20 is 6 decimals.</p>
    </div>
  );
}
