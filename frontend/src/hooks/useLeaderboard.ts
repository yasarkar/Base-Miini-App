"use client";

import { useState, useEffect, useCallback } from "react";
import { API_CONFIG } from "@/lib/constants";

export interface LeaderboardEntry {
  rank: number;
  fid: number;
  username: string;
  score: number;
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/score/leaderboard?limit=10");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: LeaderboardEntry[] = await response.json();
      setEntries(data);
    } catch (err) {
      console.warn("Failed to fetch leaderboard:", err);
      setError("Could not load leaderboard");
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { entries, isLoading, error, refetch: fetchLeaderboard };
}