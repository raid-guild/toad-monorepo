import { ethers } from 'ethers';

/**
 * Response from the TOAD API
 */
export interface ToadApiResponse {
    vote: number;
    reason: string;
}

/**
 * Enum for voting options
 */
export enum Answer {
    AGAINST = 0,
    FOR = 1,
    ABSTAIN = 2
}

/**
 * Interface for proposal data
 */
export interface ProposalData {
    proposalId: bigint;
    proposer: string;
    targets: string[];
    values: bigint[];
    signatures: string[];
    calldatas: string[];
    voteStart: bigint;
    voteEnd: bigint;
    description: string;
    discovered: boolean;
}

/**
 * Interface for contract ABIs
 */
export interface ContractABI {
    TOAD: any;
    Governor: any;
}

/**
 * Interface for contract instances
 */
export interface ContractInstances {
    toad: ethers.Contract;
    governor: ethers.Contract;
} 