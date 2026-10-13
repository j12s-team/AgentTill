"use client";

import { track } from "@/lib/analytics";

type Group = { id: string; title: string; items: string[]; note?: string };

/** Mirrors packages/contracts/src/AgentTill.sol + AgentTillFactory.sol (keep in sync). */
const GROUPS: Group[] = [
  {
    id: "policy",
    title: "Policy struct",
    items: ["Policy { uint256 maxPerPayment; uint256 dailyCap; uint256 sessionCap; bool allowlistEnabled; bool memoRequired; }"],
    note: "Caps: 0 = unlimited. Amounts are USDC with 6 decimals. dailyCap resets per UTC day (block.timestamp / 1 days).",
  },
  {
    id: "owner",
    title: "Owner (onlyOwner)",
    items: [
      "fund(uint256 amount)  — approve first; whenNotPaused",
      "withdraw(uint256 amount, address to)",
      "registerAgent(address agent, string name)",
      "revokeAgent(address agent)",
      "updatePolicy(Policy newPolicy)",
      "setAllowlist(address payee, bool allowed)",
      "setAllowlistBatch(address[] payees, bool allowed)",
      "pause() / unpause()",
      "transferOwnership(address newOwner) / renounceOwnership()  — inherited, OZ Ownable",
    ],
  },
  { id: "agent", title: "Agent", items: ["spend(uint256 amount, address payee, string reason) → uint256 paymentId  — nonReentrant, whenNotPaused"] },
  {
    id: "views",
    title: "Views",
    items: [
      "getPolicy() → Policy",
      "getAgent(address) → AgentInfo { bool registered; string name; uint256 spent }",
      "getAgents() → address[]",
      "remainingBudget() → uint256",
      "isPayeeAllowed(address) → bool  — true for all when allowlist is off",
      "contractUsdcBalance() → uint256",
      "public: policy, budget, sessionSpent, dailySpent, currentDay, paymentCount, agents(address), allowlist(address), usdc",
      "inherited: owner(), paused()",
    ],
  },
  {
    id: "events",
    title: "Events",
    items: [
      "TillFunded(address indexed from, uint256 amount, uint256 newBudget)",
      "TillWithdrawn(address indexed to, uint256 amount, uint256 newBudget)",
      "AgentRegistered(address indexed agent, string name)",
      "AgentRevoked(address indexed agent)",
      "PolicyUpdated(uint256 maxPerPayment, uint256 dailyCap, uint256 sessionCap, bool allowlistEnabled, bool memoRequired)",
      "AllowlistUpdated(address indexed payee, bool allowed)",
      "PaymentExecuted(uint256 indexed paymentId, address indexed agent, address indexed payee, uint256 amount, string reason, uint256 remainingBudget)",
      "TillPaused(address indexed by) / TillUnpaused(address indexed by)",
      "inherited OZ: Paused(address), Unpaused(address), OwnershipTransferred(address indexed, address indexed)",
    ],
    note: "There is no rejection event — a rejected spend is a revert with a custom error.",
  },
  {
    id: "errors",
    title: "Errors",
    items: [
      "ZeroAddress, ZeroAmount, NotAgent, AgentAlreadyRegistered, InsufficientBudget",
      "ExceedsMaxPerPayment, ExceedsDailyCap, ExceedsSessionCap, PayeeNotAllowed, MemoRequired",
      "InsufficientAllowanceOrBalance  — declared, not currently thrown (an unfunded approve fails inside SafeERC20)",
      "OZ: EnforcedPause, ExpectedPause, OwnableUnauthorizedAccount(address), OwnableInvalidOwner(address), ReentrancyGuardReentrantCall, SafeERC20FailedOperation(address)",
    ],
  },
  {
    id: "order",
    title: "Check order in spend",
    items: ["nonReentrant → whenNotPaused → registered → amount > 0 → payee ≠ 0 → memo → allowlist → maxPerPayment → budget → day rollover → dailyCap → sessionCap"],
  },
  {
    id: "factory",
    title: "AgentTillFactory",
    items: ["constructor(address usdc)", "createTill(address owner, Policy policy) → address till", "usdc() → address", "event TillCreated(address indexed till, address indexed owner, address indexed creator)"],
  },
];

export function ApiReference() {
  return (
    <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
      <nav aria-label="API reference" className="flex gap-2 overflow-x-auto text-sm lg:sticky lg:top-20 lg:flex-col lg:self-start">
        {GROUPS.map((g) => (
          <a key={g.id} href={`#api-${g.id}`} onClick={() => track("api_ref_anchor_click", { item: g.id })} className="shrink-0 rounded-md px-2 py-1 text-slate-400 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-arc-400">
            {g.title}
          </a>
        ))}
      </nav>
      <div className="space-y-4">
        {GROUPS.map((g) => (
          <div key={g.id} id={`api-${g.id}`} className="scroll-mt-20 rounded-2xl border border-white/5 bg-ink-900 p-5">
            <h3 className="font-semibold text-white">{g.title}</h3>
            <ul className="mt-3 space-y-1.5 overflow-x-auto">
              {g.items.map((i) => (
                <li key={i} className="whitespace-pre font-mono text-xs leading-5 text-slate-200">{i}</li>
              ))}
            </ul>
            {g.note && <p className="mt-3 text-sm text-slate-400">{g.note}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
