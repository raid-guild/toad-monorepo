import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { apiKeys, supportedChains } from './constants';
import { QueryClient } from '@tanstack/react-query';
import { Chain } from 'wagmi/chains';

if (!supportedChains || supportedChains.length === 0) {
    throw new Error('No supported chains configured');
}

// Create a new QueryClient instance
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
        },
    },
});

// Create the Wagmi config
export const config = getDefaultConfig({
    appName: 'TOAD',
    projectId: apiKeys.walletConnect,
    chains: supportedChains as unknown as readonly [Chain, ...Chain[]],
    ssr: false,
}); 