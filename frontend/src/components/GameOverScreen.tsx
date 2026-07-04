"use client";

import { useState, useEffect } from "react";
import { useFarcasterSDK } from "@/hooks/useFarcasterSDK";
import { useSubmitScore } from "@/hooks/useSubmitScore";
import { ShareCastButton } from "./ShareCastButton";
import { BasePayButtonWrapper } from "./BasePayButtonWrapper";
import { Leaderboard } from "./Leaderboard";

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

export function GameOverScreen({ score, onRestart }: GameOverScreenProps) {
  const { fid, username } = useFarcasterSDK();
  const { submitScore, isSubmitting, submitError, submitSuccess } = useSubmitScore();
  const [hasUnlockedFlatCap, setHasUnlockedFlatCap] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  // Load flat cap state from localStorage on mount
  useEffect(() => {
    try {
      const unlocked = localStorage.getItem("shelby_flat_cap_unlocked") === "true";
      setHasUnlockedFlatCap(unlocked);
    } catch (e) {
      console.error("Failed to load flat cap state:", e);
    }
  }, []);

  // Auto-submit score on mount
  useEffect(() => {
    if (score > 0 && !scoreSubmitted) {
      submitScore({ fid, username, score });
      setScoreSubmitted(true);
    }
  }, [score, fid, username, submitScore, scoreSubmitted]);

  const handlePaymentSuccess = () => {
    try {
      localStorage.setItem("shelby_flat_cap_unlocked", "true");
    } catch (e) {
      console.error("Failed to save flat cap state:", e);
    }
    setHasUnlockedFlatCap(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 fade-in">
      <div className="bg-birmingham-dark border-2 border-garrison-amber p-6 max-w-sm w-full mx-4 shadow-[0_0_20px_rgba(180,83,9,0.5)]">
        {/* Game Over Header */}
        <div className="text-center mb-4 border-b border-garrison-amber/20 pb-3">
          <h2 className="text-2xl font-bold text-garrison-amber mb-1 font-serif tracking-wider">GAME OVER</h2>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-retro">Shelby was caught</p>
        </div>

        {/* Score Display */}
        <div className="text-center mb-4 bg-garrison-wood/40 border border-garrison-amber/10 py-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
          <div className="text-3xl font-bold text-white font-retro">
            {score.toLocaleString()}
          </div>
          <p className="text-gray-400 text-[9px] uppercase tracking-widest font-retro mt-1.5">final score</p>
        </div>

        {/* Score Submission Status */}
        <div className="text-center mb-3 h-4">
          {isSubmitting && (
            <p className="text-[10px] text-garrison-amber font-retro pulse">Submitting ledger...</p>
          )}
          {submitError && (
            <p className="text-[10px] text-red-500 font-retro">Ledger failed (offline)</p>
          )}
          {submitSuccess && (
            <p className="text-[10px] text-green-500 font-retro">✓ Score saved to Garrison</p>
          )}
        </div>

        {/* Flat Cap Unlock */}
        {hasUnlockedFlatCap && (
          <div className="text-center mb-4 p-2 bg-garrison-wood border border-garrison-amber/30">
            <p className="text-garrison-amber text-xs font-semibold font-retro">
              🎩 Flat Cap Unlocked!
            </p>
            <p className="text-gray-400 text-[10px] mt-1">
              Thomas Shelby is now wearing his signature cap
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5 mb-5">
          <button
            onClick={onRestart}
            className="w-full px-4 py-3 rounded-none text-xs font-retro tracking-widest uppercase text-birmingham-dark bg-garrison-amber hover:bg-yellow-600 transition-all duration-200 focus:outline-none shadow-[0_2px_10px_rgba(180,83,9,0.2)]"
          >
            🔄 Play Again
          </button>

          <ShareCastButton score={score} />

          <BasePayButtonWrapper
            onPaymentSuccess={handlePaymentSuccess}
            disabled={hasUnlockedFlatCap}
          />
        </div>

        {/* Leaderboard */}
        <div className="border-t border-garrison-amber/20 pt-4">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}