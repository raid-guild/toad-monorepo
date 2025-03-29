import { ethers } from 'ethers';
import axios from 'axios';
import cron from 'node-cron';
import {
    TOAD_WALLET_PRIVATE_KEY,
    RPC_URL,
    TOAD,
    GOVERNOR_ADDRESS,
    TOAD_API_ENDPOINT,
    DEBUG_MODE
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
    private readonly PROPOSAL_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

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
     * Fetches proposals from the TOAD API
     * @returns Array of proposal data
     */
    private async fetchProposalsFromApi(): Promise<ProposalData[]> {
        try {
            console.log('Fetching proposals from TOAD API...');
            const response = await axios.get<ApiResponse>(`${TOAD_API_ENDPOINT}/proposals`);

            // Check if response.data exists and has the correct structure
            if (!response.data?.proposals?.nodes || !Array.isArray(response.data.proposals.nodes)) {
                console.error('Invalid API response format:', response.data);
                return [];
            }

            // Validate and transform the data
            const proposals = response.data.proposals.nodes.map((proposal: ApiProposal) => {
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
                    description: proposal.metadata?.description || proposal.metadata?.title || ''
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

            for (const proposal of proposals) {
                try {
                    console.log('\n=== Processing Proposal ===');
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

            // Get answer from TOAD API
            const response = await axios.get<ToadApiResponse>(
                `${TOAD_API_ENDPOINT}/answer?proposal=${proposalId}`
            );
            const { vote, reason } = response.data;
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
            // For now, we'll use a hardcoded list of active proposals
            const activeProposals = [BigInt(2554592239879718274)]; // Example proposal ID

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
        } catch (error) {
            console.error('Error checking active proposals:', error);
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