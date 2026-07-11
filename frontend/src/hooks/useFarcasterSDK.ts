"use client";

import { useEffect, useState, useRef } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import type { FarcasterContext } from "@/lib/farcaster";

export function useFarcasterSDK() {
  const [farcasterContext, setFarcasterContext] = useState<FarcasterContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useRef(false);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      if (isInitialized.current) return;
      isInitialized.current = true;

      try {
        // CRITICAL: Call and await ready() FIRST to dismiss the splash screen.
        // Per Farcaster docs, this must be called as early as possible.
        // If not called promptly, users see "Ready not called" and an
        // infinite splash screen.
        console.log("[Farcaster SDK] Calling sdk.actions.ready()...");
        await sdk.actions.ready();
        console.log("[Farcaster SDK] sdk.actions.ready() completed.");

        // Now try to read Farcaster context (optional — may fail if not in mini-app)
        console.log("[Farcaster SDK] Getting context...");
        const contextPromise = sdk.context;
        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
        const context = await Promise.race([contextPromise, timeoutPromise]);
        console.log("[Farcaster SDK] Context received:", context);

        if (mounted && context?.user) {
          setFarcasterContext({
            fid: context.user.fid ?? 0,
            username: context.user.username ?? null,
            displayName: context.user.displayName ?? null,
            pfpUrl: context.user.pfpUrl ?? null,
            isAuthenticated: true,
          });
        }
      } catch (error) {
        console.warn("[Farcaster SDK] Initialization failed:", error);
      } finally {
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
