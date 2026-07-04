"use client";

import { FARCASTER_CONFIG } from "@/lib/constants";

interface ShareCastButtonProps {
  score: number;
}

export function ShareCastButton({ score }: ShareCastButtonProps) {
  const handleShare = () => {
    const appUrl = FARCASTER_CONFIG.appUrl;
    const text = `I just scored ${score} in Shelby’s Ledger: Birmingham Escape! Can you beat my record in the Garrison? 🏃💨 ${appUrl}`;
    const castUrl = `https://farcaster.xyz/~/compose?text=${encodeURIComponent(text)}`;
    window.open(castUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleShare}
      className="w-full px-4 py-3 rounded-none text-xs font-retro tracking-widest uppercase border border-garrison-amber text-garrison-amber hover:bg-garrison-amber hover:text-birmingham-dark transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-garrison-amber"
    >
      📣 Share on Farcaster
    </button>
  );
}