import { ethers } from 'ethers';
import { discoverProposalsFunction, answerFunction } from '../discoverProposalsFunction';
import { TOAD_ABI } from '../abis/TOAD_ABI';

// Mock fetch
global.fetch = jest.fn();

// Mock ethers
jest.mock('ethers', () => ({
    providers: {
        JsonRpcProvider: jest.fn(),
    },
    Wallet: jest.fn(),
    Contract: jest.fn(),
    BigNumber: {
        from: jest.fn((val) => val),
    },
}));

describe('Gelato Functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('discoverProposalsFunction', () => {
        it('should successfully discover proposals', async () => {
            // Mock API response
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({
                    proposals: [
                        { id: '1', votingPeriod: '100' },
                        { id: '2', votingPeriod: '200' },
                    ],
                }),
            });

            // Mock contract call
            const mockTx = { hash: '0x123', wait: jest.fn() };
            (ethers.Contract as jest.Mock).mockImplementation(() => ({
                discoverProposals: jest.fn().mockResolvedValue(mockTx),
            }));

            const result = await discoverProposalsFunction();

            expect(result.success).toBe(true);
            expect(result.txHash).toBe('0x123');
            expect(result.proposalsProcessed).toBe(2);
        });

        it('should handle API errors', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                statusText: 'API Error',
            });

            const result = await discoverProposalsFunction();

            expect(result.success).toBe(false);
            expect(result.error).toContain('API Error');
        });
    });

    describe('answerFunction', () => {
        it('should successfully answer proposals', async () => {
            // Mock contract call for getActiveProposals
            (ethers.Contract as jest.Mock).mockImplementation(() => ({
                getActiveProposals: jest.fn().mockResolvedValue([
                    { id: '1' },
                    { id: '2' },
                ]),
                answer: jest.fn().mockResolvedValue({ hash: '0x456', wait: jest.fn() }),
            }));

            // Mock API responses
            (global.fetch as jest.Mock)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ answer: 'FOR' }),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ answer: 'AGAINST' }),
                });

            const result = await answerFunction();

            expect(result.success).toBe(true);
            expect(result.txHash).toBe('0x456');
            expect(result.proposalsAnswered).toBe(2);
        });

        it('should handle API errors for individual proposals', async () => {
            // Mock contract call for getActiveProposals
            (ethers.Contract as jest.Mock).mockImplementation(() => ({
                getActiveProposals: jest.fn().mockResolvedValue([
                    { id: '1' },
                    { id: '2' },
                ]),
                answer: jest.fn().mockResolvedValue({ hash: '0x456', wait: jest.fn() }),
            }));

            // Mock API responses with one error
            (global.fetch as jest.Mock)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ answer: 'FOR' }),
                })
                .mockResolvedValueOnce({
                    ok: false,
                    statusText: 'API Error',
                });

            const result = await answerFunction();

            expect(result.success).toBe(false);
            expect(result.error).toContain('API Error');
        });
    });
}); 