/**
 * Farcaster Mini App SDK helpers
 * 
 * This module provides a safe wrapper around the @farcaster/miniapp-sdk
 * with graceful fallbacks when running outside of a Farcaster client.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sdkInstance: any = null;

export interface FarcasterContext {
  fid: number;
  username: string | null;
  displayName: string | null;
  pfpUrl: string | null;
  isAuthenticated: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FarcasterSDK = any;

export async function initFarcasterSDK(): Promise<FarcasterContext | null> {
  try {
    // Dynamic import with proper error boundary
    let sdkModule: { default?: FarcasterSDK };
    try {
      sdkModule = await import("@farcaster/miniapp-sdk");
    } catch (importError) {
      console.warn("[Farcaster] SDK module could not be loaded:", importError);
      return null;
    }

    const sdk = sdkModule.default || sdkModule;

    if (!sdk || !sdk.context) {
      console.warn("[Farcaster] SDK loaded but has no context API");
      return null;
    }

    // Initialize the SDK
    let context: { user?: { fid?: number; username?: string; displayName?: string; pfpUrl?: string } } | null = null;
    try {
      context = await sdk.context;
    } catch (contextError) {
      console.warn("[Farcaster] Could not read SDK context:", contextError);
      return null;
    }

    sdkInstance = sdk;

    if (context && context.user) {
      return {
        fid: context.user.fid ?? 0,
        username: context.user.username ?? null,
        displayName: context.user.displayName ?? null,
        pfpUrl: context.user.pfpUrl ?? null,
        isAuthenticated: true,
      };
    }

    return null;
  } catch (error) {
    console.warn("[Farcaster] SDK initialization failed:", error);
    return null;
  }
}

export function signalReady(): void {
  try {
    if (sdkInstance && sdkInstance.actions && typeof sdkInstance.actions.ready === "function") {
      sdkInstance.actions.ready();
    }
  } catch (error) {
    // Silently ignore — running outside Farcaster client
  }
}

/**
 * Composes a Farcaster cast URL with optional link embed.
 * Uses `embed=` (singular, properly formatted) for the link.
 */
export function composeCastUrl(text: string, link?: string): string {
  const encodedText = encodeURIComponent(text);
  if (link) {
    // Use the singular `embed` parameter for standard Farcaster compose URL
    return `https://warpcast.com/~/compose?text=${encodedText}&embed=${encodeURIComponent(link)}`;
  }
  return `https://warpcast.com/~/compose?text=${encodedText}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getFarcasterContext(): any {
  return sdkInstance;
}
