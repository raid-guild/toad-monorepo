/**
 * Interface for the API proposal response
 */
export interface ApiProposal {
    id: string;
    start?: { timestamp: string };
    end?: { timestamp: string };
    proposer?: { address: string };
    metadata?: {
        title?: string;
        description?: string;
    };
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