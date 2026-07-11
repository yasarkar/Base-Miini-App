"use client";

import { useState, useCallback, useRef } from "react";

interface SubmitScoreParams {
  fid: number;
  username: string;
  score: number;
  duration: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sessionToken: any;
}

export function useSubmitScore() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  // Ref-based guard to prevent double submission even in Strict Mode re-renders
  const hasSubmittedRef = useRef(false);

  const submitScore = useCallback(async ({ fid, username, score, duration, sessionToken }: SubmitScoreParams) => {
    // Prevent double submission for the same mount lifecycle
    if (hasSubmittedRef.current) {
      return false;
    }
    hasSubmittedRef.current = true;

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
