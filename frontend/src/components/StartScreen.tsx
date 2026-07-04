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
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-[800px] bg-birmingham-dark border-2 border-garrison-amber p-8 shadow-[0_0_20px_rgba(180,83,9,0.4)] relative overflow-hidden">
      {/* smoky/industrial overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,36,30,0.4),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-garrison-amber/30 to-transparent pointer-events-none" />
      
      {/* Content Container */}
      <div className="z-10 text-center flex flex-col items-center max-w-lg">
        {/* Flat cap silhouette icon */}
        <div className="mb-6 text-garrison-amber drop-shadow-[0_0_8px_rgba(180,83,9,0.6)] animate-pulse">
          <svg className="w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c-5.5 0-10 2.24-10 5v1c0 .55.45 1 1 1h18c.55 0 1-.45 1-1v-1c0-2.76-4.5-5-10-5zm-8 7.5c-1.1 0-2 .9-2 2s.9 2 2 2h16c1.1 0 2-.9 2-2s-.9-2-2-2H4zm6.5 5.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5h2c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5h-2z" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-garrison-amber tracking-wider uppercase mb-1 drop-shadow-[0_3px_5px_rgba(0,0,0,0.9)] font-serif">
          SHELBY'S LEDGER
        </h1>
        <p className="text-xs md:text-sm text-industrial-gray font-retro tracking-widest uppercase mb-8 border-b border-garrison-amber/20 pb-4 w-full">
          Birmingham Escape
        </p>

        {/* Narrative description */}
        <p className="text-gray-400 text-sm leading-relaxed mb-8 px-4 font-sans max-w-md">
          Dodge factory pipes and police barricades through the industrial smog of 1920s Birmingham. Help Thomas Shelby escape the law and protect the family's assets.
        </p>

        {/* High Score */}
        {highScore > 0 && (
          <div className="mb-8 px-6 py-2 bg-garrison-wood/60 border border-garrison-amber/30 text-[10px] font-retro text-gray-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
            🏆 BEST LEDGER: <span className="text-garrison-amber font-bold">{highScore.toLocaleString()}</span>
          </div>
        )}

        {/* Start Game Button */}
        <button
          onClick={onStartGame}
          className="group relative px-8 py-4 rounded-none text-xs font-retro tracking-widest uppercase text-white bg-garrison-wood border border-garrison-amber hover:bg-garrison-amber hover:text-birmingham-dark transition-all duration-300 shadow-[0_4px_15px_rgba(180,83,9,0.25)] focus:outline-none focus:ring-1 focus:ring-garrison-amber mb-10"
        >
          START ESCAPE
          <span className="absolute -inset-0.5 bg-garrison-amber opacity-0 group-hover:opacity-10 blur transition-all duration-300" />
        </button>

        {/* Controls Guide */}
        <div className="flex justify-center items-center gap-6 text-[10px] text-gray-500 border-t border-garrison-amber/10 pt-6 w-full font-retro">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-garrison-wood border border-garrison-amber/20 text-gray-300 text-[9px] font-bold">SPACE</span>
            <span>JUMP</span>
          </div>
          <div className="h-4 w-px bg-garrison-amber/10" />
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-garrison-wood border border-garrison-amber/20 text-gray-300 text-[9px] font-bold">TAP</span>
            <span>MOBILE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
