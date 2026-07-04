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
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-garrison-amber font-bold text-[10px] uppercase tracking-wider font-retro">
          Garrison Top 10
        </h3>
        <button
          onClick={refetch}
          className="text-[9px] font-retro text-gray-500 hover:text-garrison-amber transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="space-y-1 max-h-[140px] overflow-y-auto">
        {entries.map((entry) => (
          <div
            key={`${entry.fid}-${entry.rank}`}
            className="flex items-center justify-between px-3 py-1.5 bg-garrison-wood/20 border border-garrison-amber/10 rounded-none"
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-6 text-center font-bold text-xs font-retro ${
                  entry.rank === 1
                    ? "text-yellow-500"
                    : entry.rank === 2
                    ? "text-gray-400"
                    : entry.rank === 3
                    ? "text-amber-700"
                    : "text-gray-600"
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
              <span className="text-xs font-mono text-gray-300">
                {entry.username || `FID:${entry.fid}`}
              </span>
            </div>
            <span className="text-xs font-retro text-garrison-amber">
              {entry.score.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}