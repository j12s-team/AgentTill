import { CopyButton } from "./CopyButton";
import { TrackedLink } from "./TrackedLink";
import { VerifiedBadge } from "./VerifiedBadge";
import { explorerAddressUrl, type NetworkId } from "@/config/chains";
import { shortAddress } from "@/lib/format";

type Props = {
  network: NetworkId;
  address: `0x${string}` | null;
  verified?: boolean;
  page: string;
};

export function AddressRow({ network, address, verified = false, page }: Props) {
  const label = network === "mainnet" ? "Arc Mainnet" : "Arc Testnet";
  return (
    <div className="flex min-h-10 flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-white/10 bg-ink-900/80 px-3 py-1.5 text-sm">
      <span className="w-24 shrink-0 text-slate-400">{label}</span>
      {address ? (
        <>
          <code className="font-mono text-slate-100" title={address}>
            {shortAddress(address)}
          </code>
          <CopyButton
            value={address}
            label={`Copy ${network} till address`}
            event={{ name: "address_copy", props: { network, page } }}
          />
          <TrackedLink
            href={explorerAddressUrl(network, address)}
            className="text-arc-300 underline-offset-2 hover:underline"
            event={{ name: "explorer_link_click", props: { network, page } }}
            ariaLabel={`View ${label} till on explorer`}
          >
            Explorer ↗
          </TrackedLink>
          {verified && <VerifiedBadge />}
        </>
      ) : (
        <span className="text-slate-300">
          <span aria-hidden="true" className="mr-1.5 inline-block h-2 w-2 rounded-full bg-amber-500" />
          Deploying — testnet live
        </span>
      )}
    </div>
  );
}
