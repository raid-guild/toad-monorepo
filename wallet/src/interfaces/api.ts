/**
 * Interface for the API proposal response
 */
export interface ApiProposal {
    id: string;
    governor: {
        id: string;
        token: {
            decimals: number;
        };
        parameters: {
            proposalThreshold: string;
        };
        organization: {
            id: string;
            slug: string;
        };
    };
    metadata: {
        title: string;
        description: string;
    };
    start: {
        timestamp: string;
    };
    end: {
        timestamp: string;
    };
    createdAt: string;
    voteStats: Array<{
        type: string;
        votesCount: string;
        votersCount: number;
        percent: number;
    }>;
    status: string;
    proposer: {
        address: string;
    };
    discovered: boolean;
}

/**
 * Interface for the API response structure
 */
export interface ApiResponse {
    proposals: {
        nodes: ApiProposal[];
        pageInfo: {
            firstCursor: string;
            lastCursor: string;
            count: number;
        };
    };
} 