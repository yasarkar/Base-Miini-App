"use client";

import { useLeaderboard } from "@/hooks/useLeaderboard";

export function Leaderboard() {
  const { entries, isLoading, error, refetch } = useLeaderboard();

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <p className="text-[10px] text-gray-500 font-retro pulse">Loading ledger...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-[10px] text-red-400 font-retro">{error}</p>
        <button
          onClick={refetch}
          className="mt-2 text-[10px] text-garrison-amber font-retro hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-[10px] text-gray-500 font-retro">No ledgers recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 select-none">
        <h3 className="text-[#4d3d34] font-bold text-[9px] uppercase tracking-[0.22em] font-mono">
          Garrison Tavern Ledger
        </h3>
        <button
          onClick={refetch}
          className="text-[8px] font-mono tracking-widest text-[#8c6a12] hover:text-[#4d3d34] transition-colors font-bold cursor-pointer"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="space-y-1 max-h-[135px] overflow-y-auto pr-0.5 scrollbar-thin">
        {entries.map((entry) => (
          <div
            key={`${entry.fid}-${entry.rank}`}
            className="flex items-center justify-between px-3 py-1.5 bg-[#e6d9bf]/35 border border-[#8c6a12]/15 rounded-none shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-6 text-center font-bold text-xs font-mono ${
                  entry.rank === 1
                    ? "text-[#c59b27]"
                    : entry.rank === 2
                    ? "text-gray-500"
                    : entry.rank === 3
                    ? "text-[#8c6a12]"
                    : "text-[#5c4a3f]"
                }`}
              >
                {entry.rank === 1
                  ? "🥇"
                  : entry.rank === 2
                  ? "🥈"
                  : entry.rank === 3
                  ? "🥉"
                  : `#${entry.rank}`}
              </span>
              <span className="text-xs font-mono text-[#3a2f28] font-bold">
                {entry.username || `FID:${entry.fid}`}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-[#9c2a1b] tracking-wider">
              {entry.score.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}