import { GelatoOpsSDK } from "@gelatonetwork/ops-sdk";
import { ethers } from "ethers";
import { TOAD_ABI } from "./abis/TOAD_ABI";

// Configuration
const TOAD_CONTRACT_ADDRESS = process.env.TOAD_CONTRACT_ADDRESS || "";
const RPC_URL = process.env.RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

// Initialize providers and contracts
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const toadContract = new ethers.Contract(
    TOAD_CONTRACT_ADDRESS,
    TOAD_ABI,
    wallet
);

export async function discoverProposalsFunction() {
    try {
        // 1. Fetch proposals from API
        const response = await fetch('https://toadn.com/api/proposals');
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        const data = await response.json();

        // 2. Process proposals
        const tallyIds = data.proposals.map((p: any) => ethers.BigNumber.from(p.id));
        const votingPeriods = data.proposals.map((p: any) => ethers.BigNumber.from(p.votingPeriod));

        // 3. Call smart contract using existing discoverProposals function
        const tx = await toadContract.discoverProposals(tallyIds, votingPeriods);
        await tx.wait();

        // 4. Return execution data
        return {
            success: true,
            txHash: tx.hash,
            timestamp: new Date().toISOString(),
            proposalsProcessed: tallyIds.length
        };
    } catch (error) {
        console.error('Error in discoverProposalsFunction:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        };
    }
} 