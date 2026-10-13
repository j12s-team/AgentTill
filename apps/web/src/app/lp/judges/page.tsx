import type { Metadata } from "next";
import Image from "next/image";
import { AddressRow } from "@/components/marketing/AddressRow";
import { BrandHeader } from "@/components/marketing/BrandHeader";
import { CriteriaChecklist, type Criterion } from "@/components/marketing/CriteriaChecklist";
import { DemoVideo } from "@/components/marketing/DemoVideo";
import { FirewallDemo } from "@/components/marketing/FirewallDemo";
import { MarketingFooter } from "@/components/marketing/Footer";
import { PageView } from "@/components/marketing/PageView";
import { PrimaryCTA } from "@/components/marketing/PrimaryCTA";
import { TrackedLink } from "@/components/marketing/TrackedLink";
import { WhyArc } from "@/components/marketing/WhyArc";
import { explorerAddressUrl } from "@/config/chains";
import {
  BUILDER_PROFILE_URL,
  DEMO_VIDEO_URL,
  FOUNDRY_TEST_COUNT,
  LINKS,
  MAINNET_TILL,
  MAINNET_VERIFIED,
  ROUTES,
  SITE_URL,
  TESTNET_TILL,
} from "@/lib/marketing/site";

const TITLE = "AgentTill — for Arc Microgrants judges";
const DESC = "A USDC till your AI agent can't overspend. Owners set budget, caps and allowlist onchain; agents spend inside it. Live on Arc.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESC,
  alternates: { canonical: ROUTES.judges },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: ROUTES.judges,
    type: "website",
    images: [{ url: "/brand/hero-flow-1200x630.png", width: 1200, height: 630, alt: "AgentTill: payment streams converging through a policy arch into a USDC till" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/brand/hero-flow-1200x630.png"] },
};

const PAGE = "judges";
const link = "text-arc-300 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-arc-400";

export default function JudgesPage() {
  const criteria: Criterion[] = [
    {
      id: "mainnet",
      requirement: "Live deployment on Arc mainnet",
      evidence: MAINNET_TILL ? `Mainnet till ${MAINNET_TILL.slice(0, 6)}…${MAINNET_TILL.slice(-4)}${MAINNET_VERIFIED ? ", verified" : ""}` : "Deploying — testnet till is live now",
      status: MAINNET_TILL ? "done" : "pending",
      link: MAINNET_TILL
        ? { href: explorerAddressUrl("mainnet", MAINNET_TILL), label: "explorer.arc.io ↗" }
        : { href: explorerAddressUrl("testnet", TESTNET_TILL), label: "Testnet explorer ↗" },
    },
    { id: "repo", requirement: "Public repository", evidence: "j12s-team/AgentTill", status: "done", link: { href: LINKS.repo, label: "GitHub ↗" } },
    { id: "why-arc", requirement: "What it does + why Arc", evidence: "Problem / Solution / Why Arc block (on this page)", status: "done", link: { href: "#why-arc", label: "#why-arc" } },
    {
      id: "builder",
      requirement: "Builder profile",
      evidence: "DoraHacks / GitHub profile of the builder",
      status: BUILDER_PROFILE_URL ? "done" : "pending",
      link: BUILDER_PROFILE_URL ? { href: BUILDER_PROFILE_URL, label: "Profile ↗" } : undefined,
    },
    { id: "tests", requirement: "(bonus) Tests", evidence: `${FOUNDRY_TEST_COUNT} Foundry tests`, status: "done", link: { href: LINKS.tests, label: "packages/contracts/test ↗" } },
  ];

  return (
    <>
      <PageView event="judges_view" />
      <BrandHeader page="judges" />

      {/* 1. Hero */}
      <section aria-labelledby="hero-h1" className="relative isolate overflow-hidden">
        <Image src="/brand/hero-flow.webp" alt="" aria-hidden="true" fill priority unoptimized sizes="100vw" className="-z-20 object-cover object-[70%_50%] opacity-70" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-950/40" />
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 md:px-6 md:pb-20 md:pt-20">
          <p className="text-sm font-medium text-arc-300">Circle Arc Microgrants · Live on Arc</p>
          <h1 id="hero-h1" className="mt-3 max-w-2xl text-[32px] font-semibold leading-[38px] tracking-tight text-white md:text-5xl md:leading-[56px]">
            A USDC till your AI agent can&apos;t overspend.
          </h1>
          <p className="mt-3 max-w-xl text-base leading-6 text-slate-200">
            Owners set the budget, caps and allowlist onchain. Agents spend inside it. On Arc, gas is USDC — so every limit and every fee reads in dollars.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <PrimaryCTA label="Try the demo till" target="demo" event="judges_cta_try_demo_click" startDemo />
            <TrackedLink href={LINKS.repo} className={`text-sm ${link}`} event={{ name: "repo_link_click", props: { page: PAGE, target: "hero" } }}>
              View on GitHub ↗
            </TrackedLink>
          </div>
          <div className="mt-5 grid max-w-xl gap-2">
            <AddressRow network="mainnet" address={MAINNET_TILL} verified={MAINNET_VERIFIED} page={PAGE} />
            <AddressRow network="testnet" address={TESTNET_TILL} page={PAGE} />
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-300">
              <span><span aria-hidden="true" className="text-emerald-400">✓ </span>{FOUNDRY_TEST_COUNT} Foundry tests passing</span>
              <span>Open source (MIT)</span>
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 md:px-6">
        {/* 2. 60-second path */}
        <section aria-labelledby="path-h">
          <h2 id="path-h" className="text-2xl font-semibold tracking-tight text-white">The 60-second path</h2>
          <ol className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              ["1. Check the deploy (10s)", "Open the till address above on the Arc explorer. Bytecode, owner and events are public."],
              ["2. Watch the firewall (30s)", "Run the scripted walkthrough below: one payment clears, four get stopped by policy."],
              ["3. Verify the code (20s)", "Read AgentTill.sol — every check in spend() is a single line with a typed error."],
            ].map(([h, b]) => (
              <li key={h} className="rounded-2xl border border-white/5 bg-ink-900 p-5">
                <h3 className="font-semibold text-white">{h}</h3>
                <p className="mt-2 text-sm text-slate-300">{b}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 3. Demo */}
        <section id="demo" tabIndex={-1} aria-labelledby="demo-h" className="scroll-mt-20 focus:outline-none">
          <h2 id="demo-h" className="text-2xl font-semibold tracking-tight text-white">Policy firewall walkthrough</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">Five agent calls against the testnet till&apos;s policy. View-only: reads come from public RPC, with a bundled fixture if it is down.</p>
          <div className="mt-6">
            <FirewallDemo />
          </div>
        </section>

        {/* 4. Criteria */}
        <section aria-labelledby="criteria-h">
          <h2 id="criteria-h" className="text-2xl font-semibold tracking-tight text-white">Arc Microgrants criteria</h2>
          <div className="mt-4">
            <CriteriaChecklist items={criteria} />
          </div>
        </section>

        {/* 5. Why Arc */}
        <section id="why-arc" aria-labelledby="why-h" className="scroll-mt-20">
          <h2 id="why-h" className="text-2xl font-semibold tracking-tight text-white">Problem · Solution · Why Arc</h2>
          <div className="mt-4">
            <WhyArc />
          </div>
        </section>

        {/* 6. Video */}
        <section aria-labelledby="video-h">
          <h2 id="video-h" className="text-2xl font-semibold tracking-tight text-white">Demo video</h2>
          <div className="mt-4 max-w-4xl">
            <DemoVideo src={DEMO_VIDEO_URL} />
          </div>
        </section>

        {/* 7. Links */}
        <section aria-labelledby="links-h">
          <h2 id="links-h" className="text-2xl font-semibold tracking-tight text-white">Links</h2>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {[
              ["repo", "Repository — j12s-team/AgentTill", LINKS.repo],
              ["contract", "Contract — packages/contracts/src/AgentTill.sol", LINKS.contract],
              ["factory", "Factory — packages/contracts/src/AgentTillFactory.sol", LINKS.factory],
              ["tests", `Tests — ${FOUNDRY_TEST_COUNT} Foundry tests`, LINKS.tests],
              ["deploy", "DEPLOY.md", LINKS.deployDoc],
              ["dashboard", "Live dashboard", LINKS.dashboard],
            ].map(([id, label, href]) => (
              <li key={id}>
                <TrackedLink href={href} className={link} event={{ name: "repo_link_click", props: { page: PAGE, target: id } }}>
                  {label}
                </TrackedLink>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-slate-300">
            Building with it?{" "}
            <TrackedLink href={ROUTES.developers} className={link} event={{ name: "cross_link_click", props: { from: "judges", to: "developers" } }}>
              Developers →
            </TrackedLink>
          </p>
        </section>

        {/* 8. Footer CTA */}
        <section aria-label="Try the demo" className="rounded-2xl border border-white/10 bg-gradient-to-br from-arc-500/20 to-ink-900 p-6 text-center shadow-glow md:p-10">
          <p className="text-xl font-semibold text-white">See the firewall stop four bad payments.</p>
          <div className="mt-4">
            <PrimaryCTA label="Try the demo till" target="demo" event="judges_cta_try_demo_click" startDemo />
          </div>
        </section>
      </div>
      <MarketingFooter />
    </>
  );
}
