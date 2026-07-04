"use client";

import { useEffect, useState } from "react";

interface StartScreenProps {
  onStartGame: () => void;
}

export function StartScreen({ onStartGame }: StartScreenProps) {
  const [highScore, setHighScore] = useState<number>(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("shelby_high_score");
      if (stored) {
        setHighScore(parseInt(stored, 10));
      }
    } catch (e) {
      console.error("Failed to read high score:", e);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-[800px] bg-gradient-to-br from-[#0f0f12] via-[#16161c] to-[#0f0f12] rounded-xl border border-[#c9a84c]/20 p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative smoky/industrial background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(199,168,76,0.05),transparent_60%)] pointer-events-none" />
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#c9a84c]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#c9a84c]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="z-10 text-center flex flex-col items-center max-w-lg">
        {/* Flat cap silhouette icon */}
        <div className="mb-4 text-[#c9a84c] animate-pulse">
          <svg className="w-16 h-16 mx-auto drop-shadow-[0_0_10px_rgba(199,168,76,0.3)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c-5.5 0-10 2.24-10 5v1c0 .55.45 1 1 1h18c.55 0 1-.45 1-1v-1c0-2.76-4.5-5-10-5zm-8 7.5c-1.1 0-2 .9-2 2s.9 2 2 2h16c1.1 0 2-.9 2-2s-.9-2-2-2H4zm6.5 5.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5h2c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5h-2z" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#c9a84c] tracking-widest uppercase mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-serif">
          SHELBY'S LEDGER
        </h1>
        <p className="text-sm md:text-md text-[#e0e0e0] font-mono tracking-widest uppercase mb-6 border-b border-[#c9a84c]/20 pb-4 w-full">
          Birmingham Escape
        </p>

        {/* Narrative description */}
        <p className="text-gray-400 text-sm leading-relaxed mb-8 px-4 font-sans max-w-md">
          Dodge factory pipes and police barricades through the industrial smog of 1920s Birmingham. Help Thomas Shelby escape the law and protect the family's assets.
        </p>

        {/* High Score */}
        {highScore > 0 && (
          <div className="mb-6 px-4 py-1.5 bg-[#1c1c24] border border-[#c9a84c]/20 rounded-full text-xs font-mono text-gray-300 shadow-inner">
            🏆 Personal Best: <span className="text-[#c9a84c] font-bold">{highScore.toLocaleString()}</span>
          </div>
        )}

        {/* Start Game Button */}
        <button
          onClick={onStartGame}
          className="group relative px-8 py-3.5 rounded-lg text-md font-bold tracking-wider uppercase text-[#1a1a2e] bg-[#c9a84c] hover:bg-[#d4b85a] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(199,168,76,0.35)] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/50 mb-8"
        >
          Start Escape
          <span className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-[#c9a84c] to-[#fcebb6] opacity-0 group-hover:opacity-30 blur transition-all duration-300" />
        </button>

        {/* Controls Guide */}
        <div className="flex justify-center items-center gap-6 text-xs text-gray-500 border-t border-[#c9a84c]/10 pt-4 w-full font-mono">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-1 bg-[#1a1a24] border border-gray-800 rounded shadow-sm text-gray-300 text-[10px] font-bold">SPACE</span>
            <span>or</span>
            <span className="px-2 py-1 bg-[#1a1a24] border border-gray-800 rounded shadow-sm text-gray-300 text-[10px] font-bold">↑</span>
            <span>Jump</span>
          </div>
          <div className="h-4 w-px bg-gray-800" />
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-1 bg-[#1a1a24] border border-gray-800 rounded shadow-sm text-gray-300 text-[10px] font-bold">TAP SCREEN</span>
            <span>Mobile Jump</span>
          </div>
        </div>
      </div>
    </div>
  );
}
