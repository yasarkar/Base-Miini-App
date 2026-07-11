/**
 * Farcaster utility helpers (non-SDK)
 *
 * This module contains helpers that do NOT import @farcaster/miniapp-sdk
 * to avoid SSR issues. The SDK is imported directly in the client hook.
 */

export interface FarcasterContext {
  fid: number;
  username: string | null;
  displayName: string | null;
  pfpUrl: string | null;
  isAuthenticated: boolean;
}

/**
 * Composes a Farcaster cast URL with optional link embed.
 */
export function composeCastUrl(text: string, link?: string): string {
  const encodedText = encodeURIComponent(text);
  if (link) {
    return `https://warpcast.com/~/compose?text=${encodedText}&embed=${encodeURIComponent(link)}`;
  }
  return `https://warpcast.com/~/compose?text=${encodedText}`;
}