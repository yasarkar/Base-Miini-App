import { http, createConfig } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";

const chainId = parseInt(
  process.env.NEXT_PUBLIC_CHAIN_ID || "84532"
);

export const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    farcasterMiniApp(),
    coinbaseWallet({
      appName: "Shelby's Ledger: Birmingham Escape",
      appLogoUrl: "https://shelbys-ledger.vercel.app/og-image.png",
      preference: "smartWalletOnly",
    }),
  ],
  transports: {
    [baseSepolia.id]: http(
      process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL ||
        "https://sepolia.base.org"
    ),
    [base.id]: http(
      process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL ||
        "https://mainnet.base.org"
    ),
  },
  ssr: true,
});

export function getActiveChain() {
  return chainId === 8453 ? base : baseSepolia;
}