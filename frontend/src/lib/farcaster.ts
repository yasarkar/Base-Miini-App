/**
 * Farcaster Mini App SDK helpers
 * 
 * This module provides a safe wrapper around the @farcaster/miniapp-sdk
 * with graceful fallbacks when running outside of a Farcaster client.
 */

let sdkInstance: any = null;

export interface FarcasterContext {
  fid: number;
  username: string | null;
  displayName: string | null;
  pfpUrl: string | null;
  isAuthenticated: boolean;
}

export async function initFarcasterSDK(): Promise<FarcasterContext | null> {
  try {
    const sdkModule = await import("@farcaster/miniapp-sdk");
    const sdk = sdkModule.default || sdkModule;

    // Initialize the SDK
    const context = await sdk.context;
    sdkInstance = sdk;

    if (context && context.user) {
      return {
        fid: context.user.fid || 0,
        username: context.user.username || null,
        displayName: context.user.displayName || null,
        pfpUrl: context.user.pfpUrl || null,
        isAuthenticated: true,
      };
    }

    return null;
  } catch (error) {
    console.warn("Farcaster SDK not available (running outside Warpcast):", error);
    return null;
  }
}

export function signalReady(): void {
  try {
    if (sdkInstance && sdkInstance.actions) {
      sdkInstance.actions.ready();
      console.log("[Farcaster] sdk.actions.ready() called successfully");
    }
  } catch (error) {
    console.warn("[Farcaster] Could not call ready():", error);
  }
}

export function composeCastUrl(text: string, link?: string): string {
  const encodedText = encodeURIComponent(text);
  const encodedLink = link ? encodeURIComponent(`\n\n${link}`) : "";
  return `https://warpcast.com/~/compose?text=${encodedText}${encodedLink}&embeds[]=`;
}

export function getFarcasterContext(): any {
  return sdkInstance;
}