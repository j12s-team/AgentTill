import type { Metadata } from "next";
import Image from "next/image";
import { AddressRow } from "@/components/marketing/AddressRow";
import { BrandHeader } from "@/components/marketing/BrandHeader";
import { CodeBlock } from "@/components/marketing/CodeBlock";
import { MarketingFooter } from "@/components/marketing/Footer";
import { PageView } from "@/components/marketing/PageView";
import { PrimaryCTA } from "@/components/marketing/PrimaryCTA";
import { TrackedLink } from "@/components/marketing/TrackedLink";
import { WhyArc } from "@/components/marketing/WhyArc";
import { FOUNDRY_TEST_COUNT, LINKS, MAINNET_TILL, MAINNET_VERIFIED, ROUTES, SITE_URL, TESTNET_TILL } from "@/lib/marketing/site";

export const dynamic = "force-static";

const TITLE = "AgentTill — a USDC till your AI agent can't overspend";
const DESC = "Fund a till, set onchain caps and an allowlist, let your agent spend inside them. Live on Arc, where gas is USDC.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/",
    type: "website",
    images: [{ url: "/brand/hero-flow-1200x630.png", width: 1200, height: 630, alt: "AgentTill: payment streams converging through a policy arch into a USDC till" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/brand/hero-flow-1200x630.png"] },
};

const PAGE = "home";
const link = "text-arc-300 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-arc-400";
const cross = (to: string) => ({ name: "cross_link_click" as const, props: { from: "home", to } });

const TEASER = `const hash = await agent.writeContract({
  address: till, abi, functionName: "spend",
  args: [parseUnits("2.50", 6), payee, "inference: 1k tokens"],
}); // reverts if outside the owner's policy`;

const CALLS: { amount: string; note: string; ok: boolean; why: string }[] = [
  { amount: "$25.00", note: "inference: 1k tokens", ok: true, why: "Inside every cap" },
  { amount: "$250.00", note: "bulk data", ok: false, why: "Over max per payment" },
  { amount: "$40.00", note: "(no memo)", ok: false, why: "Memo required" },
];

export default function HomePage() {
  return (
    <>
      <PageView event="home_view" />
      <BrandHeader page="home" />

      {/* 1. Hero */}
      <section aria-labelledby="hero-h1" className="relative isolate overflow-hidden">
        <Image src="/brand/hero-flow.webp" alt="" aria-hidden="true" fill priority unoptimized sizes="100vw" className="-z-20 object-cover object-[70%_50%] opacity-70" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-950/40" />
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 md:px-6 md:pb-20 md:pt-20">
          <p className="text-sm font-medium text-arc-300">Policy firewall for agent payments · Live on Arc</p>
          <h1 id="hero-h1" className="mt-3 max-w-2xl text-[32px] font-semibold leading-[38px] tracking-tight text-white md:text-5xl md:leading-[56px]">
            A USDC till your AI agent can&apos;t overspend.
          </h1>
          <p className="mt-3 max-w-xl text-base leading-6 text-slate-200">
            Fund it, set caps and an allowlist onchain, let your agent pay. On Arc, gas is USDC — every limit and fee reads in dollars.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <PrimaryCTA label="Open the dashboard" href={ROUTES.dashboard} event="home_cta_click" />
            <TrackedLink href={ROUTES.judges} className={`text-sm ${link}`} event={cross("judges")}>Judging? 60-second tour →</TrackedLink>
            <TrackedLink href={ROUTES.developers} className={`text-sm ${link}`} event={cross("developers")}>Build with it →</TrackedLink>
          </div>
          <div className="mt-5 grid max-w-xl gap-2">
            <AddressRow network="mainnet" address={MAINNET_TILL} verified={MAINNET_VERIFIED} page={PAGE} />
            <AddressRow network="testnet" address={TESTNET_TILL} page={PAGE} />
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-300">
              <span><span aria-hidden="true" className="text-emerald-400">✓ </span>{FOUNDRY_TEST_COUNT} Foundry tests passing</span>
              <TrackedLink href={LINKS.repo} className={link} event={{ name: "repo_link_click", props: { page: PAGE, target: "hero" } }}>Open source (MIT) ↗</TrackedLink>
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 md:px-6">
        {/* 2. How it works */}
        <section aria-labelledby="how-h">
          <h2 id="how-h" className="text-2xl font-semibold tracking-tight text-white">How it works</h2>
          <ol className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              ["1. Fund", "Deposit a USDC budget into your till. It is escrowed onchain; only you can withdraw."],
              ["2. Set policy", "Max per payment, daily and session caps, payee allowlist, memo requirement, pause."],
              ["3. Agent spends", "Your agent calls spend(amount, payee, reason). Anything outside policy reverts."],
            ].map(([h, b]) => (
              <li key={h} className="rounded-2xl border border-white/5 bg-ink-900 p-5">
                <h3 className="font-semibold text-white">{h}</h3>
                <p className="mt-2 text-sm text-slate-300">{b}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 3. Firewall teaser */}
        <section aria-labelledby="fw-h">
          <h2 id="fw-h" className="text-2xl font-semibold tracking-tight text-white">The policy firewall</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">Example policy: $100 max per payment, memo required. One call clears; the others never move a cent.</p>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {CALLS.map((c) => (
              <li key={c.amount} className={`rounded-2xl border p-5 ${c.ok ? "border-emerald-500/30 bg-emerald-500/5" : "border-rose-500/30 bg-rose-500/5"}`}>
                <p className="font-mono text-lg text-white">{c.amount}</p>
                <p className="text-sm text-slate-400">{c.note}</p>
                <p className={`mt-2 text-sm font-medium ${c.ok ? "text-emerald-300" : "text-rose-300"}`}>
                  <span aria-hidden="true">{c.ok ? "✓ " : "✕ "}</span>
                  {c.ok ? "Allowed" : "Rejected"} — {c.why}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            <TrackedLink href={`${ROUTES.judges}#demo`} className={link} event={cross("judges-demo")}>Run the full walkthrough against the testnet till →</TrackedLink>
          </p>
        </section>

        {/* 4. Why Arc */}
        <section id="why-arc" aria-labelledby="why-h" className="scroll-mt-20">
          <h2 id="why-h" className="text-2xl font-semibold tracking-tight text-white">Problem · Solution · Why Arc</h2>
          <div className="mt-4"><WhyArc /></div>
        </section>

        {/* 5. Code teaser */}
        <section aria-labelledby="code-h">
          <h2 id="code-h" className="text-2xl font-semibold tracking-tight text-white">One function for your agent</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">Plain viem against the deployed contract — no SDK to install.</p>
          <div className="mt-4 max-w-3xl"><CodeBlock code={TEASER} lang="ts" title="spend.ts" snippet="home-spend" /></div>
          <p className="mt-4 text-sm">
            <TrackedLink href={ROUTES.developers} className={link} event={cross("developers")}>Full quickstart, framework adapters and API →</TrackedLink>
          </p>
        </section>

        {/* 6. Audience split */}
        <section aria-labelledby="who-h">
          <h2 id="who-h" className="text-2xl font-semibold tracking-tight text-white">Start where you are</h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              ["Judges", "Deploy proof, criteria checklist and a live firewall walkthrough in 60 seconds.", ROUTES.judges, "60-second tour →", "judges"],
              ["Developers", "Deploy your own till and wire spend() into LangChain, Eliza, AutoGPT or Daydreams.", ROUTES.developers, "Build with it →", "developers"],
              ["Owners", "Fund a till, register agents, tune policy and watch the ledger.", ROUTES.dashboard, "Go to dashboard →", "dashboard"],
            ].map(([h, b, href, cta, to]) => (
              <li key={h} className="flex flex-col rounded-2xl border border-white/5 bg-ink-900 p-5">
                <h3 className="font-semibold text-white">{h}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-300">{b}</p>
                <TrackedLink href={href} className={`mt-4 text-sm ${link}`} event={cross(to)}>{cta}</TrackedLink>
              </li>
            ))}
          </ul>
        </section>

        {/* 7. Final CTA */}
        <section aria-label="Open the dashboard" className="rounded-2xl border border-white/10 bg-gradient-to-br from-arc-500/20 to-ink-900 p-6 text-center shadow-glow md:p-10">
          <p className="text-xl font-semibold text-white">Give your agent a budget it can&apos;t exceed.</p>
          <div className="mt-4"><PrimaryCTA label="Open the dashboard" href={ROUTES.dashboard} event="home_cta_click" /></div>
        </section>
      </div>
      <MarketingFooter />
    </>
  );
}
