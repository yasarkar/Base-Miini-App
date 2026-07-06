"use client";

import { useState, useCallback, useEffect } from "react";
import { StartScreen } from "@/components/StartScreen";
import { GameCanvas } from "@/components/GameCanvas";
import { GameOverScreen } from "@/components/GameOverScreen";
import { useFarcasterSDK } from "@/hooks/useFarcasterSDK";

type GamePhase = "start" | "playing" | "gameover";

export default function Home() {
  const { isLoading: sdkLoading } = useFarcasterSDK();
  const [gamePhase, setGamePhase] = useState<GamePhase>("start");
  const [finalScore, setFinalScore] = useState(0);
  const [finalDuration, setFinalDuration] = useState(0);
  const [gameKey, setGameKey] = useState(0);
  const [sessionToken, setSessionToken] = useState<any>(null);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/score");
      if (res.ok) {
        const data = await res.json();
        setSessionToken(data);
      }
    } catch (e) {
      console.error("Failed to fetch session token:", e);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const handleStartGame = useCallback(() => {
    setGamePhase("playing");
  }, []);

  const handleGameOver = useCallback((score: number, duration: number) => {
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
    setFinalDuration(duration);
    setGamePhase("gameover");
  }, []);

  const handleScoreUpdate = useCallback((_score: number) => {
    // Real-time score updates if needed
  }, []);

  const handleRestart = useCallback(() => {
    setGameKey((prev) => prev + 1);
    setGamePhase("playing");
    setFinalScore(0);
    setFinalDuration(0);
    fetchSession();
  }, [fetchSession]);

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
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#0d0d0f] text-[#e3e3e8] p-4 relative overflow-hidden">
      {/* Cinematic Overlays */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />

      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative w-full max-w-[800px] z-10">
        {gamePhase === "start" ? (
          <StartScreen onStartGame={handleStartGame} />
        ) : (
          <div className="flex flex-col items-center">
            {/* Header */}
            <div className="text-center mb-5 select-none">
              <h1 className="text-3xl font-serif font-extrabold text-metallic-gold tracking-[0.25em] uppercase">
                SHELBY'S LEDGER
              </h1>
              <p className="text-[10px] text-garrison-amber/60 uppercase tracking-[0.3em] font-mono mt-1">
                Birmingham Escape
              </p>
            </div>

            {/* Game Container */}
            <div
              className="relative w-full overflow-hidden rounded-none border-2 border-garrison-amber/30 shadow-[0_0_30px_rgba(0,0,0,0.8)] bg-birmingham-dark"
              style={{ maxHeight: "400px", aspectRatio: "2 / 1" }}
            >
              <GameCanvas
                key={gameKey}
                onGameOver={handleGameOver}
                onScoreUpdate={handleScoreUpdate}
              />
            </div>

            {/* Controls hint */}
            <div className="text-center mt-5">
              <p className="text-[10px] text-gray-500 font-mono tracking-wider">
                Press{" "}
                <kbd className="px-2 py-0.5 bg-garrison-wood border border-garrison-amber/30 rounded-none text-garrison-amber text-[9px] font-bold font-mono shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  SPACE
                </kbd>{" "}
                or{" "}
                <kbd className="px-2 py-0.5 bg-garrison-wood border border-garrison-amber/30 rounded-none text-garrison-amber text-[9px] font-bold font-mono shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
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
        <GameOverScreen
          score={finalScore}
          duration={finalDuration}
          sessionToken={sessionToken}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}