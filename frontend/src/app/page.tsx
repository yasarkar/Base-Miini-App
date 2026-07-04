"use client";

import { useState, useCallback } from "react";
import { StartScreen } from "@/components/StartScreen";
import { GameCanvas } from "@/components/GameCanvas";
import { GameOverScreen } from "@/components/GameOverScreen";
import { useFarcasterSDK } from "@/hooks/useFarcasterSDK";

type GamePhase = "start" | "playing" | "gameover";

export default function Home() {
  const { isLoading: sdkLoading } = useFarcasterSDK();
  const [gamePhase, setGamePhase] = useState<GamePhase>("start");
  const [finalScore, setFinalScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);

  const handleStartGame = useCallback(() => {
    setGamePhase("playing");
  }, []);

  const handleGameOver = useCallback((score: number) => {
    // Save high score locally
    try {
      const stored = localStorage.getItem("shelby_high_score");
      const currentHigh = stored ? parseInt(stored, 10) : 0;
      if (score > currentHigh) {
        localStorage.setItem("shelby_high_score", score.toString());
      }
    } catch (e) {
      console.error("Failed to save high score:", e);
    }
    setFinalScore(score);
    setGamePhase("gameover");
  }, []);

  const handleScoreUpdate = useCallback((_score: number) => {
    // Real-time score updates if needed
  }, []);

  const handleRestart = useCallback(() => {
    setGameKey((prev) => prev + 1);
    setGamePhase("playing");
    setFinalScore(0);
  }, []);

  if (sdkLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f0f12]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f12] text-[#e0e0e0] p-4 relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative w-full max-w-[800px] z-10">
        {gamePhase === "start" ? (
          <StartScreen onStartGame={handleStartGame} />
        ) : (
          <div className="flex flex-col items-center">
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="text-2xl font-serif font-extrabold text-[#c9a84c] tracking-widest uppercase">
                SHELBY'S LEDGER
              </h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-mono mt-0.5">
                Birmingham Escape
              </p>
            </div>

            {/* Game Container */}
            <div
              className="relative w-full overflow-hidden rounded-xl border border-[#c9a84c]/20 shadow-2xl bg-[#1a1a2e]"
              style={{ maxHeight: "400px", aspectRatio: "2 / 1" }}
            >
              <GameCanvas
                key={gameKey}
                onGameOver={handleGameOver}
                onScoreUpdate={handleScoreUpdate}
              />
            </div>

            {/* Controls hint */}
            <div className="text-center mt-4">
              <p className="text-xs text-gray-500 font-mono">
                Press{" "}
                <kbd className="px-1.5 py-0.5 bg-[#16213e] border border-[#c9a84c]/20 rounded text-[#c9a84c] text-xs font-bold font-mono">
                  SPACE
                </kbd>{" "}
                or{" "}
                <kbd className="px-1.5 py-0.5 bg-[#16213e] border border-[#c9a84c]/20 rounded text-[#c9a84c] text-xs font-bold font-mono">
                  ↑
                </kbd>{" "}
                or Tap Screen to Jump
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Game Over Overlay */}
      {gamePhase === "gameover" && (
        <GameOverScreen score={finalScore} onRestart={handleRestart} />
      )}
    </main>
  );
}