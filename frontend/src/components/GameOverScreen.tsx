"use client";

import { useState, useEffect } from "react";
import type { GameSession } from "@/lib/scoreToken";
import { useFarcasterSDK } from "@/hooks/useFarcasterSDK";
import { useSubmitScore } from "@/hooks/useSubmitScore";
import { ShareCastButton } from "./ShareCastButton";
import { BasePayButtonWrapper } from "./BasePayButtonWrapper";
import { Leaderboard } from "./Leaderboard";

interface GameOverScreenProps {
  score: number;
  duration: number;
  sessionToken: GameSession | null;
  onRestart: () => void;
}

export function GameOverScreen({ score, duration, sessionToken, onRestart }: GameOverScreenProps) {
  const { fid, username } = useFarcasterSDK();
  const { submitScore, isSubmitting, submitError, submitSuccess } = useSubmitScore();
  const [hasUnlockedFlatCap, setHasUnlockedFlatCap] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  // Load flat cap state from localStorage on mount (always available client-side)
  useEffect(() => {
    const unlocked = localStorage.getItem("shelby_flat_cap_unlocked") === "true";
    setHasUnlockedFlatCap(unlocked);
  }, []);

  // Auto-submit score on mount
  useEffect(() => {
    if (score > 0 && !scoreSubmitted) {
      submitScore({ fid, username, score, duration, sessionToken });
      setScoreSubmitted(true);
    }
  }, [score, duration, sessionToken, fid, username, submitScore, scoreSubmitted]);

  const handlePaymentSuccess = () => {
    localStorage.setItem("shelby_flat_cap_unlocked", "true");
    setHasUnlockedFlatCap(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm fade-in select-none">
      <div className="bg-[#f0e6d2] border-4 border-double border-[#4d3d34] p-6 max-w-sm w-full mx-4 shadow-[0_15px_40px_rgba(0,0,0,0.85)] relative">
        {/* Brass corner bracket lines for vintage look */}
        <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#8c6a12]/40" />
        <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#8c6a12]/40" />
        <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#8c6a12]/40" />
        <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#8c6a12]/40" />

        {/* Game Over Header */}
        <div className="text-center mb-4 border-b-2 border-dashed border-[#8c6a12]/30 pb-3">
          <h2 className="text-3xl font-serif font-extrabold text-[#9c2a1b] tracking-[0.12em]">WANTED</h2>
          <p className="text-[#5c4a3f] text-[9px] uppercase tracking-[0.25em] font-mono mt-1 font-bold">
            Birmingham Apprehension
          </p>
        </div>

        {/* Score Display (Ledger entry style) */}
        <div className="text-center mb-4 bg-[#e6d9bf] border border-[#c5b596] py-3.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)] relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-[#a0281c]/25 px-2 py-0.5 text-[9px] text-[#a0281c]/25 font-bold uppercase tracking-[0.2em] rotate-12 pointer-events-none">
            GARRISON CLOSED
          </div>
          <div className="text-3xl font-mono font-bold text-[#1c1613] tracking-widest relative z-10">
            {score.toLocaleString()}
          </div>
          <p className="text-[#5c4a3f] text-[9px] uppercase tracking-[0.2em] font-mono mt-1 relative z-10 font-bold">
            Final Ledger Balance
          </p>
        </div>

        {/* Score Submission Status */}
        <div className="text-center mb-3.5 h-4 select-none">
          {isSubmitting && (
            <p className="text-[9px] text-[#8c6a12] font-mono tracking-wider pulse font-bold">Telegraphing ledger data...</p>
          )}
          {submitError && (
            <p className="text-[9px] text-red-700 font-mono tracking-wider font-bold">✓ Ledger Offline (Apprehended)</p>
          )}
          {submitSuccess && (
            <p className="text-[9px] text-green-800 font-mono tracking-wider font-bold">✓ Ledger Stamped in Black Book</p>
          )}
        </div>

        {/* Flat Cap Unlock Badge */}
        {hasUnlockedFlatCap && (
          <div className="text-center mb-4 p-2.5 bg-[#e6d9bf] border border-[#c5b596] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <p className="text-[#8c6a12] text-[10px] font-bold font-mono tracking-wider">
              🎩 SIGNATURE FLAT CAP UNLOCKED
            </p>
            <p className="text-[#5c4a3f] text-[9px] mt-0.5">
              Thomas Shelby is now wearing his razor-lined cap.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 mb-4">
          <button
            onClick={onRestart}
            className="w-full px-4 py-3 rounded-none text-xs font-mono tracking-[0.2em] uppercase text-white bg-[#4d3d34] hover:bg-[#614e42] transition-all duration-200 focus:outline-none border border-[#30251f] shadow-[0_2px_6px_rgba(0,0,0,0.2)] cursor-pointer"
          >
            🔄 RE-RUN ESCAPE
          </button>

          <ShareCastButton score={score} />

          <BasePayButtonWrapper
            onPaymentSuccess={handlePaymentSuccess}
            disabled={hasUnlockedFlatCap}
          />
        </div>

        {/* Leaderboard Section */}
        <div className="border-t border-[#8c6a12]/20 pt-4">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}