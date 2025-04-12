import { ethers } from 'ethers';
import axios from 'axios';
import cron from 'node-cron';
import {
    TOAD_WALLET_PRIVATE_KEY,
    RPC_URL,
    TOAD,
    GOVERNOR_ADDRESS,
    TOAD_API_ENDPOINT,
    DEBUG_MODE,
    RATE_LIMIT
} from '../constants';
import { Answer, ProposalData, ContractInstances, ToadApiResponse } from '../types';
import { loadContractABIs } from '../utils/abiLoader';
import { ApiProposal, ApiResponse } from '../interfaces/api';
import { executeOrSimulateTransaction } from '../utils/transaction';

/**
 * Service class that handles TOAD wallet operations
 */
export class ToadService {
    private provider: ethers.JsonRpcProvider;
    private wallet: ethers.Wallet;
    private contracts: ContractInstances;
    private retryCount: number = 0;
    private readonly MAX_RETRIES = 5;
    private readonly INITIAL_RETRY_DELAY = 5000; // 5 seconds
    private readonly PROPOSAL_CHECK_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours
    private isChecking: boolean = false;
    private requestCount: number = 0;
    private lastResetTime: number = Date.now();
    private readonly HOUR_IN_MS = 60 * 60 * 1000;

    constructor() {
        console.log('Initializing ToadService...');
        console.log(`Using RPC URL: ${RPC_URL}`);
        console.log(`TOAD Contract Address: ${TOAD}`);
        console.log(`Governor Contract Address: ${GOVERNOR_ADDRESS}`);
        console.log(`Debug Mode: ${DEBUG_MODE ? 'Enabled' : 'Disabled'}`);

        this.provider = new ethers.JsonRpcProvider(RPC_URL);
        this.wallet = new ethers.Wallet(TOAD_WALLET_PRIVATE_KEY, this.provider);
        console.log(`Connected wallet address: ${this.wallet.address}`);

        this.contracts = this.initializeContracts();
        console.log('ToadService initialized successfully');
    }

    /**
     * Initializes contract instances
     * @returns ContractInstances object containing initialized contracts
     */
    private initializeContracts(): ContractInstances {
        console.log('Loading contract ABIs...');
        const abis = loadContractABIs();
        console.log('ABIs loaded successfully');

        console.log('Initializing TOAD contract...');
        const toadContract = new ethers.Contract(
            TOAD,
            abis.TOAD,
            this.wallet
        );
        console.log('TOAD contract initialized');

        console.log('Initializing Governor contract...');
        const governorContract = new ethers.Contract(
            GOVERNOR_ADDRESS,
            abis.Governor,
            this.wallet
        );
        console.log('Governor contract initialized');

        return { toad: toadContract, governor: governorContract };
    }

    /**
     * Checks if we can make an API request based on rate limit
     * @returns boolean indicating if request can be made
     */
    private canMakeRequest(): boolean {
        const now = Date.now();
        // Reset counter if an hour has passed
        if (now - this.lastResetTime >= this.HOUR_IN_MS) {
            this.requestCount = 0;
            this.lastResetTime = now;
        }

        if (this.requestCount >= RATE_LIMIT) {
            console.log(`Rate limit reached (${RATE_LIMIT} requests per hour). Waiting for reset...`);
            return false;
        }

        this.requestCount++;
        return true;
    }

    /**
     * Makes a rate-limited API request
     * @param url The API endpoint URL
     * @returns The API response
     */
    private async makeRateLimitedRequest<T>(url: string): Promise<T> {
        while (!this.canMakeRequest()) {
            // Wait for 1 minute before checking again
            await new Promise(resolve => setTimeout(resolve, 60 * 1000));
        }

        const response = await axios.get<T>(url);
        return response.data;
    }

    /**
     * Fetches proposals from the TOAD API
     * @returns Array of proposal data
     */
    private async fetchProposalsFromApi(): Promise<ProposalData[]> {
        try {
            console.log('Fetching proposals from TOAD API...');
            const response = await this.makeRateLimitedRequest<ApiResponse>(`${TOAD_API_ENDPOINT}/proposals`);

            // Check if response.data exists and has the correct structure
            if (!response.proposals?.nodes || !Array.isArray(response.proposals.nodes)) {
                console.error('Invalid API response format:', response);
                return [];
            }

            // Validate and transform the data
            const proposals = response.proposals.nodes.map((proposal: ApiProposal) => {
                // Ensure all required fields are present and properly formatted
                if (!proposal.id || !proposal.start?.timestamp || !proposal.end?.timestamp) {
                    console.error('Invalid proposal data:', proposal);
                    return null;
                }

                // Convert ISO timestamps to Unix timestamps
                const startTime = Math.floor(new Date(proposal.start.timestamp).getTime() / 1000);
                const endTime = Math.floor(new Date(proposal.end.timestamp).getTime() / 1000);

                const proposalData: ProposalData = {
                    proposalId: BigInt(proposal.id),
                    proposer: proposal.proposer?.address || '',
                    targets: [], // These fields are not in the API response
                    values: [],
                    signatures: [],
                    calldatas: [],
                    voteStart: BigInt(startTime),
                    voteEnd: BigInt(endTime),
                    description: proposal.metadata?.description || proposal.metadata?.title || '',
                    discovered: proposal.discovered || false
                };
                return proposalData;
            }).filter((proposal): proposal is ProposalData => proposal !== null);

            console.log(`Found ${proposals.length} valid proposals`);
            return proposals;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('API request failed:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data
                });
            } else {
                console.error('Error fetching proposals from API:', error);
            }
            return [];
        }
    }

    /**
     * Starts monitoring for new proposals
     */
    public async startProposalListener() {
        try {
            console.log('\n=== Starting Proposal Monitor ===');
            console.log('Setting up proposal monitoring...');

            // Initial check for proposals
            await this.checkForNewProposals();

            // Set up interval to check for new proposals
            setInterval(async () => {
                await this.checkForNewProposals();
            }, this.PROPOSAL_CHECK_INTERVAL);

            console.log('Proposal monitor started successfully');
            this.retryCount = 0;
        } catch (error) {
            console.error('Error starting proposal monitor:', error);

            // Implement exponential backoff
            if (this.retryCount < this.MAX_RETRIES) {
                const delay = this.INITIAL_RETRY_DELAY * Math.pow(2, this.retryCount);
                this.retryCount++;
                console.log(`Retrying proposal monitor setup in ${delay / 1000} seconds... (Attempt ${this.retryCount}/${this.MAX_RETRIES})`);
                setTimeout(() => {
                    this.startProposalListener();
                }, delay);
            } else {
                console.error('Max retries reached. Please check your API endpoint and network connection.');
            }
        }
    }

    /**
     * Checks for new proposals and processes them
     */
    private async checkForNewProposals() {
        try {
            const proposals = await this.fetchProposalsFromApi();

            if (proposals.length === 0) {
                console.log('No proposals to process');
                return;
            }

            // Filter for undiscovered proposals
            const undiscoveredProposals = proposals.filter(p => !p.discovered);
            console.log(`Found ${undiscoveredProposals.length} undiscovered proposals`);

            if (undiscoveredProposals.length === 0) {
                console.log('No undiscovered proposals to process');
                return;
            }

            for (const proposal of undiscoveredProposals) {
                try {
                    console.log('\n=== Processing Undiscovered Proposal ===');
                    console.log('Proposal ID:', proposal.proposalId.toString());
                    console.log('Proposer:', proposal.proposer);
                    console.log('Vote Start:', new Date(Number(proposal.voteStart) * 1000).toISOString());
                    console.log('Vote End:', new Date(Number(proposal.voteEnd) * 1000).toISOString());
                    console.log('Description:', proposal.description);
                    console.log('==============================\n');

                    await this.handleNewProposal(
                        proposal.proposalId,
                        proposal.voteStart,
                        proposal.voteEnd
                    );
                } catch (error) {
                    console.error('Error processing proposal:', error);
                }
            }
        } catch (error) {
            console.error('Error checking for new proposals:', error);
        }
    }

    /**
     * Handles a new proposal
     * @param proposalId The proposal ID
     * @param voteStart The vote start timestamp
     * @param voteEnd The vote end timestamp
     */
    private async handleNewProposal(proposalId: bigint, voteStart: bigint, voteEnd: bigint) {
        console.log('\nProcessing new proposal:', proposalId.toString());
        try {
            // Check if proposal already exists on the contract
            const storedProposals = await this.checkStoredProposals();
            if (storedProposals.includes(proposalId)) {
                console.log(`Proposal ${proposalId} already exists on the contract, skipping discovery`);
            } else {
                // Get the voting period
                const votingPeriod = voteEnd - voteStart;
                console.log('Voting period:', votingPeriod.toString());

                // Submit the proposal to TOAD contract
                const tx = await executeOrSimulateTransaction(
                    this.contracts.toad,
                    'discoverProposals',
                    [[proposalId], [votingPeriod]],
                    this.provider,
                    this.wallet
                );

                if (!DEBUG_MODE) {
                    await tx.wait();
                }
                console.log(`${DEBUG_MODE ? 'Simulated' : 'Successfully submitted'} proposal to TOAD contract`);
            }

            // Get answer from TOAD API
            const response = await this.makeRateLimitedRequest<ToadApiResponse>(
                `${TOAD_API_ENDPOINT}/answer?proposal=${proposalId}`
            );
            const { vote, reason } = response;
            console.log(`Received answer for proposal ${proposalId}:`, { vote, reason });

            // Submit answer to TOAD contract
            await executeOrSimulateTransaction(
                this.contracts.toad,
                'answer',
                [[proposalId], [vote], [reason]],
                this.provider,
                this.wallet
            );
            console.log(`${DEBUG_MODE ? 'Simulated' : 'Successfully submitted'} answer for proposal ${proposalId}`);

            // Check if TOAD can vote and submit vote if possible
            const canVoteResult = await this.contracts.toad.canVote([proposalId]);
            if (canVoteResult[0]) {
                await executeOrSimulateTransaction(
                    this.contracts.toad,
                    'vote',
                    [[proposalId]],
                    this.provider,
                    this.wallet
                );
                console.log(`${DEBUG_MODE ? 'Simulated' : 'Successfully submitted'} vote for proposal ${proposalId}`);
            } else {
                console.log(`TOAD cannot vote on proposal ${proposalId} at this time`);
            }

            console.log('==============================\n');
        } catch (error) {
            console.error('Error handling new proposal:', error);
        }
    }

    /**
     * Checks active proposals and submits answers
     */
    public async checkActiveProposals(): Promise<void> {
        try {
            console.log('\n=== Checking Active Proposals ===');
            const proposals = await this.fetchProposalsFromApi();

            if (proposals.length === 0) {
                console.log('No active proposals found');
                return;
            }

            // Get proposal IDs for active proposals
            const activeProposals = proposals.map(p => p.proposalId);
            console.log(`Found ${activeProposals.length} active proposals`);

            // Check if TOAD can vote
            const canVoteResult = await this.contracts.toad.canVote(activeProposals);
            console.log('Can TOAD vote:', canVoteResult[0]);

            for (const proposalId of activeProposals) {
                try {
                    // Get answer from TOAD API
                    const response = await axios.get<ToadApiResponse>(
                        `${TOAD_API_ENDPOINT}/answer?proposal=${proposalId}`
                    );
                    const { vote, reason } = response.data;

                    // Submit answer to TOAD contract
                    await executeOrSimulateTransaction(
                        this.contracts.toad,
                        'answer',
                        [[proposalId], [vote], [reason]],
                        this.provider,
                        this.wallet
                    );

                    console.log(`Submitted answer for proposal ${proposalId}:`, {
                        vote,
                        reason
                    });

                    // If TOAD can vote, submit the vote
                    if (canVoteResult[0]) {
                        await executeOrSimulateTransaction(
                            this.contracts.toad,
                            'vote',
                            [[proposalId]],
                            this.provider,
                            this.wallet
                        );
                        console.log(`Submitted vote for proposal ${proposalId}`);
                    }
                } catch (error) {
                    console.error(`Error processing proposal ${proposalId}:`, error);
                }
            }
            console.log('=== Completed Active Proposals Check ===\n');
        } catch (error) {
            console.error('Error checking active proposals:', error);
        }
    }

    /**
     * Checks proposal IDs stored on the TOAD contract
     * @returns Array of proposal IDs stored on the contract
     */
    public async checkStoredProposals(): Promise<bigint[]> {
        try {
            console.log('\n=== Checking Stored Proposals ===');

            // Get the first proposal ID to check if there are any stored
            const firstProposal = await this.contracts.toad.proposalList(0);

            if (firstProposal === 0n) {
                console.log('No proposals stored on the contract');
                return [];
            }

            // Get all stored proposal IDs
            const storedProposals: bigint[] = [];
            let index = 0;

            while (true) {
                const proposalId = await this.contracts.toad.proposalList(index);
                if (proposalId === 0n) {
                    break;
                }
                storedProposals.push(proposalId);
                index++;
            }

            console.log(`Found ${storedProposals.length} proposals stored on the contract:`,
                storedProposals.map(id => id.toString())
            );

            // For each stored proposal, get its details
            for (const proposalId of storedProposals) {
                try {
                    const proposal = await this.contracts.toad.getProposal(proposalId);
                    console.log(`\nProposal ${proposalId.toString()} details:`, {
                        tallyId: proposal.tallyId.toString(),
                        answer: proposal.answer,
                        reason: proposal.reason,
                        votingPeriod: proposal.votingPeriod.toString(),
                        disabled: proposal.disabled
                    });
                } catch (error) {
                    console.error(`Error getting details for proposal ${proposalId}:`, error);
                }
            }

            console.log('=== Completed Stored Proposals Check ===\n');
            return storedProposals;
        } catch (error) {
            console.error('Error checking stored proposals:', error);
            return [];
        }
    }

    /**
     * Starts the daily cron job to check active proposals
     */
    public startDailyCheck(): void {
        console.log('Setting up daily check cron job...');
        // Run at midnight every day
        cron.schedule('0 0 * * *', async () => {
            console.log('\n=== Running Scheduled Daily Check ===');
            await this.checkActiveProposals();
            console.log('=== Completed Scheduled Daily Check ===\n');
        });
        console.log('Daily check cron job scheduled successfully');
    }
}