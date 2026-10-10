import Image from "next/image";
import { LINKS } from "@/lib/marketing/site";

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-slate-400 md:px-6">
        <Image src="/brand/agenttill-lockup-transparent.svg" alt="AgentTill" width={120} height={46} unoptimized />
        <p>
          Open source · MIT ·{" "}
          <a href={LINKS.repo} target="_blank" rel="noreferrer" className="text-arc-300 hover:underline">
            j12s-team/AgentTill
          </a>
        </p>
      </div>
    </footer>
  );
}
