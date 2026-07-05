"use client";

import { FARCASTER_CONFIG } from "@/lib/constants";
import { composeCastUrl } from "@/lib/farcaster";

interface ShareCastButtonProps {
  score: number;
}

export function ShareCastButton({ score }: ShareCastButtonProps) {
  const handleShare = () => {
    const appUrl = FARCASTER_CONFIG.appUrl;
    const text = `I just scored ${score} in Shelby’s Ledger: Birmingham Escape! Can you beat my record in the Garrison? 🏃💨`;
    const castUrl = composeCastUrl(text, appUrl);
    window.open(castUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleShare}
      className="w-full px-4 py-3 rounded-none text-xs font-mono tracking-[0.18em] uppercase border border-[#8c6a12]/75 text-[#8c6a12] hover:bg-[#8c6a12] hover:text-[#f0e6d2] transition-all duration-200 focus:outline-none cursor-pointer"
    >
      📣 Share on Farcaster
    </button>
  );
}