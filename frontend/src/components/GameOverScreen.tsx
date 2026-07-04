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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 fade-in">
      <div className="bg-[#16213e] rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-[#1f3056]">
        {/* Game Over Header */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-[#c9a84c] mb-1">GAME OVER</h2>
          <p className="text-gray-400 text-sm">Thomas Shelby was caught</p>
        </div>

        {/* Score Display */}
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-white font-mono">
            {score.toLocaleString()}
          </div>
          <p className="text-gray-400 text-xs mt-1">final score</p>
        </div>

        {/* Score Submission Status */}
        <div className="text-center mb-3">
          {isSubmitting && (
            <p className="text-xs text-yellow-400 pulse">Submitting score...</p>
          )}
          {submitError && (
            <p className="text-xs text-red-400">Score submission failed (offline mode)</p>
          )}
          {submitSuccess && (
            <p className="text-xs text-green-400">✓ Score saved to Garrison!</p>
          )}
        </div>

        {/* Flat Cap Unlock */}
        {hasUnlockedFlatCap && (
          <div className="text-center mb-3 p-2 bg-[#1a1a2e] rounded-lg border border-[#c9a84c]/30">
            <p className="text-[#c9a84c] text-sm font-semibold">
              🎩 Pixel Flat Cap Unlocked!
            </p>
            <p className="text-gray-400 text-xs">
              Thomas Shelby now wears his signature cap
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 mb-4">
          <button
            onClick={onRestart}
            className="w-full px-4 py-2.5 rounded-lg text-sm font-bold bg-[#c9a84c] text-[#1a1a2e] hover:bg-[#d4b85a] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/50"
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
        <div className="border-t border-[#1f3056] pt-3">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}