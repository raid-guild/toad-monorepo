import { tally } from "../../../plugins/tally/src";
import { NextResponse } from 'next/server';
import { apiKeys, config, hasRequiredEnvVars, contracts } from '@/config/constants';
import { createPublicClient, http, encodeFunctionData, decodeFunctionResult, Abi, Chain } from 'viem';
import { optimism, mainnet, arbitrum } from 'viem/chains';
import TOAD_ABI from '../../../../public/abi/TOAD.json';
import MULTICALL_ABI from '../../../../public/abi/Multicall.json';
import { Proposal } from '@/types/proposal';

const customChain: Chain = {
    id: Number(process.env.CHAIN_ID),
    name: 'Custom Chain',
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: [process.env.RPC_URL || ''],
        },
    },
    blockExplorers: {
        default: {
            name: 'Custom Explorer',
            url: '',
        },
    },
};

interface ProposalView {
    tallyId: bigint;
    answer: number;
    reason: string;
    discoveredAt: bigint;
    validBlock: bigint;
    disablePower: bigint;
    votingPeriod: bigint;
    announced: boolean;
}

interface TallyProposal extends Pick<Proposal, 'id'> {
    status?: {
        active: boolean;
    };
}

async function checkProposalDiscovery(tallyProposals: TallyProposal[]) {
    const client = createPublicClient({
        chain: customChain,
        transport: http(process.env.RPC_URL),
    });

    // Prepare multicall data
    const toadAddress = process.env.TOAD as `0x${string}`;
    const multicallAddress = process.env.MULTICALL_ADDRESS as `0x${string}`;


    const calls = tallyProposals.map((proposal) => ({
        target: toadAddress,
        callData: encodeFunctionData({
            abi: TOAD_ABI.abi,
            functionName: 'getProposal',
            args: [BigInt(proposal.id)],
        }),
    }));

    // Execute multicall
    const multicallResult = await client.readContract({
        address: multicallAddress,
        abi: MULTICALL_ABI as unknown as Abi,
        functionName: 'tryAggregate',
        args: [false, calls],
    }) as { success: boolean; returnData: `0x${string}` }[];

    // Process results
    const proposalsWithDiscovery = tallyProposals.map((proposal, index) => {
        const result = multicallResult[index];
        if (!result?.success) {
            return {
                ...proposal,
                discovered: false,
                status: {
                    active: proposal.status?.active ?? false
                }
            };
        }

        try {
            const proposalData = decodeFunctionResult({
                abi: TOAD_ABI.abi,
                functionName: 'getProposal',
                data: result.returnData,
            }) as ProposalView;

            return {
                ...proposal,
                discovered: !!proposalData?.tallyId,
                status: {
                    active: proposal.status?.active ?? false
                }
            };
        } catch {
            return {
                ...proposal,
                discovered: false,
                status: {
                    active: proposal.status?.active ?? false
                }
            };
        }
    });

    return proposalsWithDiscovery;
}

export async function GET() {
    try {


        if (!process.env.TOAD || !process.env.MULTICALL_ADDRESS) {
            throw new Error('Missing required environment variables');
        }

        // Check for required environment variables
        if (!hasRequiredEnvVars()) {
            return NextResponse.json(
                { error: 'Missing required environment variables' },
                { status: 500 }
            );
        }

        // Initialize Tally service
        const tallyService = tally({
            apiKey: apiKeys.tally,
            organizationName: config.organizationName,
            chainId: config.chainId,
        });

        // Get all proposals
        const proposals = await tallyService.getTools()[0].execute({
            organization: config.organizationName,
            isDescending: true,
            limit: 50,
            afterCursor: '',
            id: 'all_proposals',
            dummy: 'dummy'
        });

        const proposalsWithDiscovery = await checkProposalDiscovery(proposals as TallyProposal[]);

        return NextResponse.json(proposalsWithDiscovery);
    } catch (error) {
        console.error('Error fetching proposals:', error);
        return NextResponse.json(
            { error: 'Failed to fetch proposals' },
            { status: 500 }
        );
    }
} 