"use client";

import { useLeaderboard } from "@/hooks/useLeaderboard";

export function Leaderboard() {
  const { entries, isLoading, error, refetch } = useLeaderboard();

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400 text-sm">Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400 text-sm">{error}</p>
        <button
          onClick={refetch}
          className="mt-2 text-xs text-[#c9a84c] hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400 text-sm">No scores yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[#c9a84c] font-bold text-sm uppercase tracking-wider">
          Garrison Top 10
        </h3>
        <button
          onClick={refetch}
          className="text-xs text-gray-400 hover:text-[#c9a84c] transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="space-y-1">
        {entries.map((entry) => (
          <div
            key={`${entry.fid}-${entry.rank}`}
            className="flex items-center justify-between px-3 py-1.5 rounded bg-[#16213e]/50"
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-6 text-center font-bold text-sm ${
                  entry.rank === 1
                    ? "text-yellow-400"
                    : entry.rank === 2
                    ? "text-gray-300"
                    : entry.rank === 3
                    ? "text-amber-600"
                    : "text-gray-500"
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
              <span className="text-sm text-gray-200">
                {entry.username || `FID:${entry.fid}`}
              </span>
            </div>
            <span className="text-sm font-mono text-[#c9a84c]">
              {entry.score.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}