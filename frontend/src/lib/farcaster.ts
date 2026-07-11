/**
 * Farcaster Mini App SDK helpers
 * 
 * This module provides a safe wrapper around the @farcaster/miniapp-sdk
 * with graceful fallbacks when running outside of a Farcaster client.
 * 
 * NOTE: @farcaster/miniapp-sdk exports `sdk` as a named export (not default).
 * The SDK communicates with the Farcaster host via postMessage.
 * sdk.actions.ready() must be awaited to signal the host to hide the splash screen.
 * sdk.context returns a promise that resolves to the Farcaster context object.
 */

export interface FarcasterContext {
  fid: number;
  username: string | null;
  displayName: string | null;
  pfpUrl: string | null;
  isAuthenticated: boolean;
}

/**
 * Signals to the Farcaster host that the mini app has finished loading
 * and the splash screen can be dismissed.
 * 
 * Per Neynar docs: "await sdk.actions.ready()" — must be awaited.
 * Gracefully handles cases where the SDK is not available.
 */
export async function signalReady(): Promise<void> {
  try {
    const sdkModule = await import("@farcaster/miniapp-sdk");
    const sdk = (sdkModule as { sdk?: unknown }).sdk as { actions?: { ready?: () => Promise<void> } } | undefined;
    if (sdk?.actions?.ready) {
      await sdk.actions.ready();
    }
  } catch {
    // Silently ignore — running outside Farcaster client
  }
}

/**
 * Initializes the Farcaster SDK and retrieves the user's Farcaster context.
 * Returns null if the SDK is not available or the user is not authenticated.
 */
export async function initFarcasterSDK(): Promise<FarcasterContext | null> {
  try {
    const sdkModule = await import("@farcaster/miniapp-sdk");
    const sdk = (sdkModule as { sdk?: { context?: Promise<unknown> } }).sdk as {
      context?: Promise<{ user?: { fid?: number; username?: string; displayName?: string; pfpUrl?: string } }>;
    } | undefined;

    if (!sdk?.context) {
      console.warn("[Farcaster] SDK loaded but has no context API");
      return null;
    }

    let context: { user?: { fid?: number; username?: string; displayName?: string; pfpUrl?: string } } | null = null;
    try {
      context = await sdk.context;
    } catch {
      console.warn("[Farcaster] Could not read SDK context");
      return null;
    }

    if (context?.user) {
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

/**
 * Composes a Farcaster cast URL with optional link embed.
 * Uses `embed=` (singular, properly formatted) for the link.
 */
export function composeCastUrl(text: string, link?: string): string {
  const encodedText = encodeURIComponent(text);
  if (link) {
    return `https://warpcast.com/~/compose?text=${encodedText}&embed=${encodeURIComponent(link)}`;
  }
  return `https://warpcast.com/~/compose?text=${encodedText}`;
}