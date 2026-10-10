import Image from "next/image";
import Link from "next/link";
import { TrackedLink } from "./TrackedLink";
import { LINKS, ROUTES } from "@/lib/marketing/site";

type Props = { page: "judges" | "developers" };

export function BrandHeader({ page }: Props) {
  const item = "rounded-md px-2.5 py-1.5 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-arc-400";
  const current = (p: string) => (p === page ? { "aria-current": "page" as const, className: `${item} text-white` } : { className: item });
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
        <Link href="/" className="shrink-0 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-arc-400">
          <Image src="/brand/agenttill-lockup-transparent.svg" alt="AgentTill" width={132} height={50} priority unoptimized />
        </Link>
        <nav aria-label="Primary" className="-mr-2 flex items-center overflow-x-auto text-sm text-slate-400">
          <Link href={ROUTES.judges} {...current("judges")}>Judges</Link>
          <Link href={ROUTES.developers} {...current("developers")}>Developers</Link>
          <Link href={ROUTES.dashboard} className={`${item} hidden sm:inline`}>Dashboard</Link>
          <TrackedLink href={LINKS.repo} className={item} event={{ name: "repo_link_click", props: { page, target: "header" } }}>
            GitHub
          </TrackedLink>
        </nav>
      </div>
    </header>
  );
}
