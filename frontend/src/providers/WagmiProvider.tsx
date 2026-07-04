"use client";

import { type ReactNode } from "react";
import { WagmiProvider as WagmiProviderBase } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/wagmi";
import { BaseAccountProvider } from "@base-account-kit/react";

const queryClient = new QueryClient();

export function WagmiProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProviderBase config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <BaseAccountProvider
          config={{
            paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL || "https://api.developer.coinbase.com/rpc/v1/base-sepolia/mock",
          }}
        >
          {children}
        </BaseAccountProvider>
      </QueryClientProvider>
    </WagmiProviderBase>
  );
}