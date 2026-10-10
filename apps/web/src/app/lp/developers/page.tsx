import type { Metadata } from "next";
import { AddressRow } from "@/components/marketing/AddressRow";
import { ApiReference } from "@/components/marketing/ApiReference";
import { BrandHeader } from "@/components/marketing/BrandHeader";
import { CodeBlock } from "@/components/marketing/CodeBlock";
import { MarketingFooter } from "@/components/marketing/Footer";
import { FrameworkTabs } from "@/components/marketing/FrameworkTabs";
import { NetworkTable } from "@/components/marketing/NetworkTable";
import { PageView } from "@/components/marketing/PageView";
import { PrimaryCTA } from "@/components/marketing/PrimaryCTA";
import { TrackedLink } from "@/components/marketing/TrackedLink";
import { TYPICAL_FEE_USD } from "@/config/chains";
import { FOUNDRY_TEST_COUNT, LINKS, ROUTES, SITE_URL, TESTNET_TILL } from "@/lib/marketing/site";
import {
  AUTOGPT_SNIPPET,
  DAYDREAMS_SNIPPET,
  DEPLOY_SNIPPET,
  ELIZA_SNIPPET,
  LANGCHAIN_SNIPPET,
  SETUP_SNIPPET,
  SPEND_SNIPPET,
} from "@/lib/marketing/snippets";

const TITLE = "AgentTill for developers — give agents a USDC budget on Arc";
const DESC = "Deploy a policy-bound USDC till on Arc, register your agent, and call one function: spend(amount, payee, reason).";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESC,
  alternates: { canonical: ROUTES.developers },
  openGraph: { title: TITLE, description: DESC, url: ROUTES.developers, type: "website", images: [{ url: "/brand/hero-flow-1200x630.png", width: 1200, height: 630, alt: "AgentTill" }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/brand/hero-flow-1200x630.png"] },
};

const PAGE = "developers";
const link = "text-arc-300 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-arc-400";

export default function DevelopersPage() {
  return (
    <>
      <PageView event="developers_view" />
      <BrandHeader page="developers" />
      <div className="mx-auto max-w-6xl space-y-16 px-4 pb-12 pt-8 md:px-6 md:pt-16">
        {/* 1. Hero + 2. snippet */}
        <section aria-labelledby="hero-h1" className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          <div>
            <h1 id="hero-h1" className="text-[32px] font-semibold leading-[38px] tracking-tight text-white md:text-5xl md:leading-[56px]">
              Give your agent a budget, not a private key.
            </h1>
            <p className="mt-3 text-base leading-6 text-slate-200">
              Deploy a policy-bound USDC till on Arc, register your agent, and call one function: <code className="font-mono text-arc-300">spend(amount, payee, reason)</code>.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <PrimaryCTA label="Deploy your till" target="deploy" event="developers_cta_deploy_click" />
              <TrackedLink href={LINKS.contract} className={`text-sm ${link}`} event={{ name: "repo_link_click", props: { page: PAGE, target: "contract" } }}>
                Read the contract ↗
              </TrackedLink>
            </div>
            <div className="mt-5 grid gap-2">
              <AddressRow network="testnet" address={TESTNET_TILL} page={PAGE} />
              <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-300">
                <span><span aria-hidden="true" className="text-emerald-400">✓ </span>{FOUNDRY_TEST_COUNT} Foundry tests</span>
                <span>USDC gas ≈ {TYPICAL_FEE_USD.replace("~", "")}</span>
              </p>
            </div>
          </div>
          <div className="min-w-0">
            <CodeBlock code={SPEND_SNIPPET} lang="ts" title="agent.ts — viem" snippet="spend" />
            <p className="mt-3 text-sm text-slate-400">
              Over policy? The call reverts with a typed error (<code className="font-mono">ExceedsDailyCap</code>, <code className="font-mono">PayeeNotAllowed</code>, …). Simulate first with <code className="font-mono">simulateContract</code>.
            </p>
          </div>
        </section>

        {/* 3. Framework tabs */}
        <section aria-labelledby="fw-h">
          <h2 id="fw-h" className="text-2xl font-semibold tracking-tight text-white">Drop it into your agent framework</h2>
          <p className="mt-2 text-sm text-slate-400">viem is the native path. The others are ~15-line adapters around the same call — copy them, there is nothing to install.</p>
          <div className="mt-4">
            <FrameworkTabs
              tabs={[
                { id: "viem", label: "viem", native: true, panel: <CodeBlock code={SPEND_SNIPPET} lang="ts" title="viem" snippet="tab-viem" /> },
                { id: "langchain", label: "LangChain", panel: <CodeBlock code={LANGCHAIN_SNIPPET} lang="ts" title="langchain-tool.ts" snippet="tab-langchain" /> },
                { id: "elizaos", label: "ElizaOS", panel: <CodeBlock code={ELIZA_SNIPPET} lang="ts" title="eliza-action.ts" snippet="tab-elizaos" /> },
                { id: "autogpt", label: "AutoGPT", panel: <CodeBlock code={AUTOGPT_SNIPPET} lang="python" title="agenttill_block.py" snippet="tab-autogpt" /> },
                { id: "daydreams", label: "Daydreams", panel: <CodeBlock code={DAYDREAMS_SNIPPET} lang="ts" title="daydreams-action.ts" snippet="tab-daydreams" /> },
              ]}
            />
          </div>
        </section>

        {/* 4. API reference */}
        <section id="api" aria-labelledby="api-h" className="scroll-mt-20">
          <h2 id="api-h" className="text-2xl font-semibold tracking-tight text-white">Contract API reference</h2>
          <p className="mt-2 text-sm text-slate-400">
            From <TrackedLink href={LINKS.contract} className={link} event={{ name: "repo_link_click", props: { page: PAGE, target: "contract" } }}>AgentTill.sol</TrackedLink> and{" "}
            <TrackedLink href={LINKS.factory} className={link} event={{ name: "repo_link_click", props: { page: PAGE, target: "factory" } }}>AgentTillFactory.sol</TrackedLink>.
          </p>
          <div className="mt-4">
            <ApiReference />
          </div>
        </section>

        {/* 5. Deploy */}
        <section id="deploy" tabIndex={-1} aria-labelledby="deploy-h" className="scroll-mt-20 focus:outline-none">
          <h2 id="deploy-h" className="text-2xl font-semibold tracking-tight text-white">Deploy a till (Foundry)</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <CodeBlock code={DEPLOY_SNIPPET} lang="bash" title="deploy.sh" snippet="deploy" />
            <div>
              <CodeBlock code={SETUP_SNIPPET} lang="bash" title="then: fund · register · allowlist" snippet="setup" />
              <p className="mt-3 text-sm text-slate-400">
                Mainnet: same script with <code className="font-mono">--rpc-url https://rpc.mainnet.arc.io</code> — see{" "}
                <TrackedLink href={LINKS.deployDoc} className={link} event={{ name: "repo_link_click", props: { page: PAGE, target: "deploy-md" } }}>DEPLOY.md</TrackedLink>.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Networks */}
        <section aria-labelledby="networks">
          <NetworkTable page={PAGE} />
        </section>

        {/* 7. Footer CTA */}
        <section aria-label="Deploy your till" className="rounded-2xl border border-white/10 bg-gradient-to-br from-arc-500/20 to-ink-900 p-6 text-center shadow-glow md:p-10">
          <p className="text-xl font-semibold text-white">One contract. One function. A budget your agent can&apos;t exceed.</p>
          <div className="mt-4">
            <PrimaryCTA label="Deploy your till" target="deploy" event="developers_cta_deploy_click" />
          </div>
          <p className="mt-4 text-sm text-slate-300">
            Judging?{" "}
            <TrackedLink href={ROUTES.judges} className={link} event={{ name: "cross_link_click", props: { from: "developers", to: "judges" } }}>
              60-second tour →
            </TrackedLink>
          </p>
        </section>
      </div>
      <MarketingFooter />
    </>
  );
}
