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
          // 1. Get context (with a timeout fallback just in case it hangs)
          console.log("[Farcaster SDK] Getting context...");
          const contextPromise = sdk.context;
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

          // 2. Call ready() to hide the splash screen.
          // We call this AFTER setting the context so the UI has already started rendering with context values,
          // or we call it even if the context timed out to ensure the splash screen goes away.
          console.log("[Farcaster SDK] Calling sdk.actions.ready()...");
          try {
            await Promise.race([
              sdk.actions.ready(),
              new Promise((resolve) => setTimeout(resolve, 500))
            ]);
            console.log("[Farcaster SDK] sdk.actions.ready() completed.");
          } catch (readyError) {
            console.warn("[Farcaster SDK] sdk.actions.ready() failed:", readyError);
          }
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