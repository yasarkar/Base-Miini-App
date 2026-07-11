"use client";

import { useEffect, useState, useRef } from "react";
import { initFarcasterSDK, signalReady, type FarcasterContext } from "@/lib/farcaster";

export function useFarcasterSDK() {
  const [farcasterContext, setFarcasterContext] = useState<FarcasterContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasSignaledReady = useRef(false);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        // Signal ready FIRST to dismiss splash screen as early as possible
        // (Neynar docs: "call ready() as early as possible, after pageload processes")
        if (!hasSignaledReady.current) {
          await signalReady();
          hasSignaledReady.current = true;
        }

        const context = await initFarcasterSDK();

        if (mounted) {
          setFarcasterContext(context);
          setIsLoading(false);
        }
      } catch (error) {
        console.warn("Farcaster SDK init error:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    farcasterContext,
    isLoading,
    fid: farcasterContext?.fid ?? (process.env.NODE_ENV === "development" ? 1919 : 0),
    username: farcasterContext?.username ?? (process.env.NODE_ENV === "development" ? "shelby" : "anonymous"),
    isAuthenticated: farcasterContext?.isAuthenticated ?? false,
  };
}
