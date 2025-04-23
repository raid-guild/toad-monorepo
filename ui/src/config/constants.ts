// This file will be loaded at runtime
import { Chain } from 'wagmi/chains';

// Contract addresses
export const contracts = {
    toad: process.env.NEXT_PUBLIC_TOAD_CONTRACT_ADDRESS as `0x${string}`,
    governance: process.env.NEXT_PUBLIC_GOVERNANCE_TOKEN_ADDRESS as `0x${string}`,
    multicall: process.env.NEXT_PUBLIC_MULTICALL_ADDRESS as `0x${string}`,
} as const;

// API Keys and Secrets
export const apiKeys = {
    tally: process.env.TALLY_API_KEY as string,
    openai: process.env.OPENAI_API_KEY as string,
    discourse: process.env.DISCOURSE_API_KEY as string,
    walletConnect: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
} as const;

// Debug logging
console.log('WalletConnect Project ID:', process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID);

// Organization and Chain Configuration
export const config = {
    organizationName: process.env.NEXT_PUBLIC_GOVERNANCE_ORGANIZATION_NAME as string,
    organizationDescription: process.env.ORGANIZATION_DESCRIPTION as string,
    chainId: process.env.NEXT_PUBLIC_CHAIN_ID as string,
    rpcProviderUrl: process.env.NEXT_PUBLIC_RPC_URL as string,
    walletPrivateKey: process.env.WALLET_PRIVATE_KEY as `0x${string}`,
} as const;

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID);
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL as string;

if (!chainId || !rpcUrl) {
    console.error('Environment variables:', {
        NEXT_PUBLIC_SUPPORTED_CHAINS: process.env.NEXT_PUBLIC_SUPPORTED_CHAINS
    });
    throw new Error('Chain ID and RPC URL must be configured');
}

const customChain: Chain = {
    id: chainId,
    name: process.env.NEXT_PUBLIC_CHAIN_NAME || 'Custom Chain',
    nativeCurrency: {
        name: process.env.NEXT_PUBLIC_CHAIN_CURRENCY_NAME || 'ETH',
        symbol: process.env.NEXT_PUBLIC_CHAIN_CURRENCY_SYMBOL || 'ETH',
        decimals: Number(process.env.NEXT_PUBLIC_CHAIN_CURRENCY_DECIMALS) || 18,
    },
    rpcUrls: {
        default: { http: [rpcUrl] },
        public: { http: [rpcUrl] },
    },
    blockExplorers: process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL ? {
        default: { name: 'Explorer', url: process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL },
    } : undefined,
    testnet: false,
};

export const supportedChains: readonly [Chain, ...Chain[]] = [customChain];

// OpenAI Configuration
export const openaiConfig = {
    model: 'gpt-4o',
    baseUrl: process.env.OPENAI_BASE_URL,
} as const;

export const gaiaConfig = {
    baseUrl: process.env.GAIA_BASE_URL,
    apiKey: process.env.GAIA_API_KEY,
    apiModel: process.env.GAIA_API_MODEL,
} as const;

// Discourse Configuration
export const discourseConfig = {
    apiUsername: process.env.DISCOURSE_API_USERNAME as string,
    baseUrl: process.env.NEXT_PUBLIC_DISCOURSE_BASE_URL as string,
} as const;

// URLs and External Services
export const urls = {
    tally: `https://www.tally.xyz/gov/${process.env.NEXT_PUBLIC_GOVERNANCE_ORGANIZATION_NAME}`,
    discourse: process.env.NEXT_PUBLIC_DISCOURSE_BASE_URL,
} as const;

// Type guards for environment variables
export const hasRequiredEnvVars = () => {
    const requiredVars = [
        'NEXT_PUBLIC_TOAD_CONTRACT_ADDRESS',
        'NEXT_PUBLIC_GOVERNANCE_TOKEN_ADDRESS',
        'TALLY_API_KEY',
        'NEXT_PUBLIC_GOVERNANCE_ORGANIZATION_NAME',
        'NEXT_PUBLIC_CHAIN_ID',
        'NEXT_PUBLIC_RPC_URL',
        'WALLET_PRIVATE_KEY',
        'OPENAI_API_KEY',
        // 'DISCOURSE_API_KEY',
        // 'DISCOURSE_API_USERNAME',
        'NEXT_PUBLIC_DISCOURSE_BASE_URL',
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error('Missing required environment variables:', missingVars);
        return false;
    }

    return true;
};

