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
      className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#1a1a2e] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/50"
    >
      📣 Share on Farcaster
    </button>
  );
}