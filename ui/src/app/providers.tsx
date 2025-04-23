'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { config, queryClient } from '../config/wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { AppProvider } from '@/context/AppContext'
import { useState, useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <AppProvider>
                        {children}
                    </AppProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
} 