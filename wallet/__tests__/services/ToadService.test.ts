import { ethers } from 'ethers';
import { ToadService } from '../../src/services/ToadService';
import axios from 'axios';
import { Answer } from '../../src/types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock environment variables
process.env.TOAD_WALLET_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
process.env.RPC_URL = 'http://localhost:8545';
process.env.TOAD = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
process.env.GOVERNOR_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
process.env.TOAD_API_ENDPOINT = 'http://localhost:3000';
process.env.DEBUG_MODE = 'true';
process.env.RATE_LIMIT = '100';

describe('ToadService', () => {
    let service: ToadService;
    let provider: ethers.JsonRpcProvider;
    let wallet: ethers.Wallet;

    beforeEach(async () => {
        // Setup provider and wallet
        provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        wallet = new ethers.Wallet(process.env.TOAD_WALLET_PRIVATE_KEY!, provider);

        // Create service instance
        service = new ToadService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('startProposalListener', () => {
        it('should start listening for new proposals', async () => {
            // Mock API responses
            mockedAxios.get.mockResolvedValueOnce({
                data: {
                    proposals: {
                        nodes: [{
                            id: '1',
                            start: { timestamp: '2024-01-01T00:00:00Z' },
                            end: { timestamp: '2024-01-08T00:00:00Z' },
                            proposer: { address: '0x123' },
                            metadata: { title: 'Test Proposal', description: 'Test Description' },
                            discovered: false
                        }]
                    }
                }
            });

            mockedAxios.get.mockResolvedValueOnce({
                data: {
                    vote: Answer.FOR,
                    reason: 'Test reason'
                }
            });

            // Start the proposal listener
            await service.startProposalListener();

            // Verify API calls
            expect(mockedAxios.get).toHaveBeenCalledWith(
                `${process.env.TOAD_API_ENDPOINT}/proposals`
            );
        });
    });

    describe('checkActiveProposals', () => {
        it('should check and process active proposals', async () => {
            // Mock API response
            mockedAxios.get.mockResolvedValueOnce({
                data: {
                    vote: Answer.FOR,
                    reason: 'Test reason'
                }
            });

            await service.checkActiveProposals();

            // In debug mode, we should see simulation results
            expect(mockedAxios.get).toHaveBeenCalled();
        });
    });

    describe('checkStoredProposals', () => {
        it('should fetch and process stored proposals', async () => {
            // Mock API response
            mockedAxios.get.mockResolvedValueOnce({
                data: {
                    vote: Answer.FOR,
                    reason: 'Test reason'
                }
            });

            const proposals = await service.checkStoredProposals();

            // In debug mode, we should see simulation results
            expect(proposals).toBeDefined();
            expect(Array.isArray(proposals)).toBe(true);
        });
    });

    describe('rate limiting', () => {
        it('should respect rate limit when making API calls', async () => {
            // Mock API response
            mockedAxios.get.mockResolvedValue({
                data: {
                    vote: Answer.FOR,
                    reason: 'Test reason'
                }
            });

            // Make 5 calls (which should all succeed)
            for (let i = 0; i < 5; i++) {
                await service.checkActiveProposals();
            }

            // Verify that all calls were made
            expect(mockedAxios.get).toHaveBeenCalledTimes(5);
        }, 10000); // Increase timeout to 10 seconds
    });
}); 