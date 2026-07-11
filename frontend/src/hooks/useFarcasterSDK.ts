"use client";

import { useEffect, useState, useRef } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import type { FarcasterContext } from "@/lib/farcaster";

export function useFarcasterSDK() {
  const [farcasterContext, setFarcasterContext] = useState<FarcasterContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasSignaledReady = useRef(false);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        // Per official Farcaster docs:
        // "After your app loads, you must call sdk.actions.ready()
        //  to hide the splash screen and display your content."
        if (!hasSignaledReady.current) {
          await sdk.actions.ready();
          hasSignaledReady.current = true;
        }

        // Read Farcaster user context
        const context = await sdk.context;

        if (mounted) {
          if (context?.user) {
            setFarcasterContext({
              fid: context.user.fid ?? 0,
              username: context.user.username ?? null,
              displayName: context.user.displayName ?? null,
              pfpUrl: context.user.pfpUrl ?? null,
              isAuthenticated: true,
            });
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.warn("[Farcaster] SDK error:", error);
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