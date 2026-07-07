"use client";

import { useState, useCallback } from "react";

interface SubmitScoreParams {
  fid: number;
  username: string;
  score: number;
  duration: number;
  sessionToken: any;
}

// Memory cache to prevent duplicate client-side submissions for the same session ID
const submittedSessionIds = new Set<string>();

export function useSubmitScore() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const submitScore = useCallback(async ({ fid, username, score, duration, sessionToken }: SubmitScoreParams) => {
    const sessionId = sessionToken?.sessionId;
    
    // Prevent double submission for the same session
    if (sessionId && submittedSessionIds.has(sessionId)) {
      return false;
    }
    
    if (sessionId) {
      submittedSessionIds.add(sessionId);
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      const response = await fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fid, username, score, duration, sessionToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP ${response.status}`);
      }

      setSubmitSuccess(true);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit score";
      setSubmitError(message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { submitScore, isSubmitting, submitError, submitSuccess, setSubmitSuccess };
}