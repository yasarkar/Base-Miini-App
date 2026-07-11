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
        // Call ready() unconditionally and as early as possible.
        // Per the Neynar SDK docs, this must be called regardless of
        // isInMiniApp() — if we're not in a mini app host the call is a no-op.
        console.log("[Farcaster SDK] Calling sdk.actions.ready()...");
        const readyPromise = sdk.actions.ready().catch((err) => {
          console.warn("[Farcaster SDK] sdk.actions.ready() failed:", err);
        });

        // Try to read Farcaster context (optional — may fail if not in mini-app)
        console.log("[Farcaster SDK] Getting context...");
        const contextPromise = sdk.context;
        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500));
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

        await readyPromise;
        console.log("[Farcaster SDK] sdk.actions.ready() completed.");
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
