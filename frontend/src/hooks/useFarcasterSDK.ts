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
        console.log("[Farcaster SDK] Checking if in mini-app...");
        const inMiniApp = await sdk.isInMiniApp();
        console.log("[Farcaster SDK] isInMiniApp result:", inMiniApp);

        if (inMiniApp) {
          // Kick off both context fetching and ready() in parallel so the
          // splash screen is dismissed as soon as possible.
          const contextPromise = sdk.context;

          // Call ready() immediately — do NOT wait for context first.
          // Hiding the splash screen is independent of having user context.
          console.log("[Farcaster SDK] Calling sdk.actions.ready()...");
          const readyPromise = sdk.actions.ready().catch((err) => {
            console.warn("[Farcaster SDK] sdk.actions.ready() failed:", err);
          });

          // Get context (with a timeout fallback just in case it hangs)
          console.log("[Farcaster SDK] Getting context...");
          const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000));
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

          // Await ready() completion (it likely already finished by now)
          await readyPromise;
          console.log("[Farcaster SDK] sdk.actions.ready() completed.");
        } else {
          console.log("[Farcaster SDK] Not in mini-app, bypassing initialization.");
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