export interface VoteStats {
    type: 'for' | 'against' | 'abstain' | 'pendingfor' | 'pendingagainst' | 'pendingabstain';
    votesCount: string;
    votersCount: number;
    percent: number;
}

export interface Timestamp {
    timestamp: string;
}

export interface Governor {
    id: string;
    token: {
        // Add token properties if needed
    };
    parameters: {
        // Add parameters properties if needed
    };
    organization: {
        // Add organization properties if needed
    };
}

export interface ProposalMetadata {
    title: string;
    description: string;
}

export interface Proposer {
    address: string;
}

export interface Proposal {
    id: string;
    governor: Governor;
    metadata: ProposalMetadata;
    start: Timestamp;
    end: Timestamp;
    createdAt: string;
    proposer: Proposer;
    status: string;
    voteStats: VoteStats[];
}

// Example proposal object
export const exampleProposal: Proposal = {
    id: '2549941682250449979',
    governor: {
        id: 'eip155:42161:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4',
        token: {},
        parameters: {},
        organization: {}
    },
    metadata: {
        title: '[NON-CONSTITUTIONAL] Arbitrum Audit Program',
        description: '# [NON-CONSTITUTIONAL] Arbitrum Audit Program\n\nDescription content...'
    },
    start: {
        timestamp: '2025-03-20T15:47:59Z'
    },
    end: {
        timestamp: '2025-04-04T07:09:23Z'
    },
    createdAt: '2025-03-17T05:58:56.332133Z',
    proposer: {
        address: '0xfE797e53eB97cF349A5Ca881Fc9a93D5beD8878D'
    },
    status: 'executed',
    voteStats: [
        {
            type: 'for',
            votesCount: '156090494676919544789888162',
            votersCount: 3324,
            percent: 79.03897274373861
        },
        {
            type: 'against',
            votesCount: '4296312417331698131500117',
            votersCount: 226,
            percent: 2.175508001015244
        },
        {
            type: 'abstain',
            votesCount: '37098672863843073803293744',
            votersCount: 759,
            percent: 18.785519255246143
        },
        {
            type: 'pendingfor',
            votesCount: '0',
            votersCount: 0,
            percent: 0
        },
        {
            type: 'pendingagainst',
            votesCount: '0',
            votersCount: 0,
            percent: 0
        },
        {
            type: 'pendingabstain',
            votesCount: '0',
            votersCount: 0,
            percent: 0
        }
    ]
}; 