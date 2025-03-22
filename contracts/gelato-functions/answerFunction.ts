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

export async function answerFunction() {
    try {
        // 1. Get active proposals from contract
        const proposals = await toadContract.getActiveProposals();

        // 2. For each proposal, fetch answer from API
        const answers = await Promise.all(
            proposals.map(async (proposal: any) => {
                const response = await fetch(`https://toadn.com/api/answer?proposal=${proposal.id}`);
                if (!response.ok) {
                    throw new Error(`API request failed for proposal ${proposal.id}: ${response.statusText}`);
                }
                const data = await response.json();
                return {
                    tallyId: ethers.BigNumber.from(proposal.id),
                    answer: data.answer
                };
            })
        );

        // 3. Call smart contract using existing answer function
        const tx = await toadContract.answer(
            answers.map(a => a.tallyId),
            answers.map(a => a.answer)
        );
        await tx.wait();

        // 4. Return execution data
        return {
            success: true,
            txHash: tx.hash,
            timestamp: new Date().toISOString(),
            proposalsAnswered: answers.length
        };
    } catch (error) {
        console.error('Error in answerFunction:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        };
    }
} 