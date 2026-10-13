export const SPEND_SNIPPET = `import { createWalletClient, http, parseUnits, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arcTestnet } from "./chains"; // chain 5042002, rpc.testnet.arc.io

const till = "0xA40E8DA38760eAf987eF85CD00b28319F11c4CAD";
const abi = parseAbi(["function spend(uint256 amount, address payee, string reason) returns (uint256)"]);
const agent = createWalletClient({ account: privateKeyToAccount(process.env.AGENT_KEY as \`0x\${string}\`), chain: arcTestnet, transport: http() });
const payee = process.env.PAYEE as \`0x\${string}\`; // allowlisted payee address

const hash = await agent.writeContract({
  address: till, abi, functionName: "spend",
  args: [parseUnits("2.50", 6), payee, "inference: 1k tokens"], // USDC = 6 decimals
});
`;

/** Shared helper the example adapters import — wraps the same viem call. */
const HELPER_NOTE = `// ./agenttill.ts exports spendUsdc(amount: string, payee, reason) — the viem call above`;

export const LANGCHAIN_SNIPPET = `${HELPER_NOTE}
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { spendUsdc } from "./agenttill";

export const agentTillSpend = new DynamicStructuredTool({
  name: "agenttill_spend",
  description: "Pay a USDC amount from the AgentTill budget. Reverts if over policy.",
  schema: z.object({
    amount: z.string().describe("USDC, e.g. '2.50'"),
    payee: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
    reason: z.string().min(1),
  }),
  func: async ({ amount, payee, reason }) =>
    spendUsdc(amount, payee as \`0x\${string}\`, reason), // returns tx hash
});
`;

export const ELIZA_SNIPPET = `${HELPER_NOTE}
import type { Action } from "@elizaos/core";
import { spendUsdc } from "./agenttill";

export const agentTillSpend: Action = {
  name: "AGENTTILL_SPEND",
  similes: ["PAY_USDC", "TILL_SPEND"],
  description: "Spend USDC from the AgentTill budget within onchain policy.",
  validate: async () => Boolean(process.env.AGENT_KEY),
  handler: async (_runtime, _message, _state, options, callback) => {
    const { amount, payee, reason } = options as { amount: string; payee: \`0x\${string}\`; reason: string };
    const hash = await spendUsdc(amount, payee, reason);
    await callback?.({ text: \`Paid \${amount} USDC — tx \${hash}\` });
    return true;
  },
  examples: [],
};
`;

export const AUTOGPT_SNIPPET = `# Example AutoGPT block — shells out to the same viem call (node spend.mjs).
import json, subprocess
from backend.data.block import Block, BlockOutput, BlockSchema

class AgentTillSpendBlock(Block):
    class Input(BlockSchema):
        amount: str   # USDC, e.g. "2.50" (6 decimals on-chain)
        payee: str
        reason: str

    class Output(BlockSchema):
        tx_hash: str

    def run(self, input_data: Input, **kwargs) -> BlockOutput:
        args = json.dumps(input_data.model_dump())
        out = subprocess.run(["node", "spend.mjs", args], capture_output=True, text=True, check=True)
        yield "tx_hash", out.stdout.strip()   # non-zero exit = policy revert
`;

export const DAYDREAMS_SNIPPET = `${HELPER_NOTE}
import { action } from "@daydreamsai/core";
import { z } from "zod";
import { spendUsdc } from "./agenttill";

export const agentTillSpend = action({
  name: "agenttill.spend",
  description: "Pay USDC from the AgentTill budget; reverts outside policy.",
  schema: z.object({
    amount: z.string(),
    payee: z.string(),
    reason: z.string().min(1),
  }),
  handler: async ({ amount, payee, reason }) => {
    const hash = await spendUsdc(amount, payee as \`0x\${string}\`, reason);
    return { hash };
  },
});
`;

export const DEPLOY_SNIPPET = `git clone https://github.com/j12s-team/AgentTill && cd AgentTill/packages/contracts
forge install && forge test            # 19 tests
export PRIVATE_KEY=0x...               # deployer funded with USDC (gas)
forge script script/Deploy.s.sol:Deploy --rpc-url https://rpc.testnet.arc.io --broadcast
# DEPLOY_FACTORY=true to also deploy AgentTillFactory, then createTill(owner, policy)
# Default policy: maxPerPayment 100, dailyCap 500, sessionCap 5,000 USDC, memoRequired, allowlist off
`;

export const SETUP_SNIPPET = `USDC=0x3600000000000000000000000000000000000000
RPC=https://rpc.testnet.arc.io
# 1. approve + fund (100 USDC = 100000000, 6 decimals)
cast send $USDC "approve(address,uint256)" $TILL 100000000 --rpc-url $RPC --private-key $PRIVATE_KEY
cast send $TILL "fund(uint256)" 100000000 --rpc-url $RPC --private-key $PRIVATE_KEY
# 2. register the agent
cast send $TILL "registerAgent(address,string)" $AGENT "my-agent" --rpc-url $RPC --private-key $PRIVATE_KEY
# 3. allowlist a payee (enforced only when policy.allowlistEnabled = true — see updatePolicy)
cast send $TILL "setAllowlist(address,bool)" $PAYEE true --rpc-url $RPC --private-key $PRIVATE_KEY
`;
