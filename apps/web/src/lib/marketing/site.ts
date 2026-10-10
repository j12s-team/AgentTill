import { getAddress, isAddress } from "viem";

export const SITE_URL = "https://agenttill.cjanneh.workers.dev";
export const REPO_URL = "https://github.com/j12s-team/AgentTill";
export const REPO_BLOB = `${REPO_URL}/blob/main`;
export const REPO_TREE = `${REPO_URL}/tree/main`;

export const LINKS = {
  repo: REPO_URL,
  contract: `${REPO_BLOB}/packages/contracts/src/AgentTill.sol`,
  factory: `${REPO_BLOB}/packages/contracts/src/AgentTillFactory.sol`,
  tests: `${REPO_TREE}/packages/contracts/test`,
  deployScript: `${REPO_BLOB}/packages/contracts/script/Deploy.s.sol`,
  deployDoc: `${REPO_BLOB}/DEPLOY.md`,
  license: `${REPO_URL}#license`,
  dashboard: "/dashboard",
} as const;

export const ROUTES = {
  judges: "/lp/judges",
  developers: "/lp/developers",
  dashboard: "/dashboard",
} as const;

/** Verified on-chain: bytecode present on Arc testnet (chain 5042002). */
export const TESTNET_TILL = "0xA40E8DA38760eAf987eF85CD00b28319F11c4CAD" as const;

function envAddress(v: string | undefined): `0x${string}` | null {
  if (!v || !isAddress(v)) return null;
  return getAddress(v);
}

/** Arc mainnet till — not yet in the repo. Unset → "Deploying — testnet live". */
export const MAINNET_TILL = envAddress(process.env.NEXT_PUBLIC_AGENT_TILL_ADDRESS_MAINNET);
/** Set to "true" only after the mainnet source has been verified on explorer.arc.io. */
export const MAINNET_VERIFIED =
  MAINNET_TILL !== null && process.env.NEXT_PUBLIC_AGENT_TILL_MAINNET_VERIFIED === "true";

export const BUILDER_PROFILE_URL = process.env.NEXT_PUBLIC_BUILDER_PROFILE_URL || null;
export const DEMO_VIDEO_URL = process.env.NEXT_PUBLIC_DEMO_VIDEO_URL || null;

/** Count of `function test…` in packages/contracts/test/*.sol (verified: 19). */
export const FOUNDRY_TEST_COUNT = 19;
