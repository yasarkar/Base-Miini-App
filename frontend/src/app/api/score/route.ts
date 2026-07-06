import { NextRequest, NextResponse } from "next/server";
import { API_CONFIG } from "@/lib/constants";
import { createGameSession, verifyGameSession, getMaxPossibleScore } from "@/lib/scoreToken";

// Memory cache for double-spend prevention (sessionId -> expiration timestamp)
const usedSessions = new Map<string, number>();

// Memory cache for rate limiting (fid -> array of submission timestamps in the last 60s)
const rateLimits = new Map<number, number[]>();

function pruneCaches() {
  const now = Date.now();

  // Prune used sessions
  for (const [sid, exp] of usedSessions.entries()) {
    if (now > exp) {
      usedSessions.delete(sid);
    }
  }

  // Prune rate limits (older than 60s)
  for (const [fid, timestamps] of rateLimits.entries()) {
    const validTimestamps = timestamps.filter((t) => now - t < 60 * 1000);
    if (validTimestamps.length === 0) {
      rateLimits.delete(fid);
    } else {
      rateLimits.set(fid, validTimestamps);
    }
  }
}

/**
 * GET: Generates a new signed game session token for the player.
 */
export async function GET() {
  try {
    const session = createGameSession();
    return NextResponse.json(session);
  } catch (error) {
    console.error("Failed to generate session token:", error);
    return NextResponse.json(
      { message: "Failed to generate game session" },
      { status: 500 }
    );
  }
}

/**
 * POST: Submits the player's score with strict anti-cheat validation.
 */
export async function POST(request: NextRequest) {
  let requestBody: any;
  try {
    pruneCaches();

    requestBody = await request.json();
    const { fid, username, score, duration, sessionToken } = requestBody;

    // 1. Validate required fields
    if (fid === undefined || score === undefined || duration === undefined || !sessionToken) {
      return NextResponse.json(
        { message: "Missing required fields: fid, score, duration, sessionToken" },
        { status: 400 }
      );
    }

    const numericFid = Number(fid);
    const numericScore = Number(score);
    const numericDuration = Number(duration);

    if (isNaN(numericFid) || isNaN(numericScore) || isNaN(numericDuration) || numericScore < 0 || numericDuration < 0) {
      return NextResponse.json(
        { message: "Invalid fid, score, or duration values" },
        { status: 400 }
      );
    }

    // 2. Rate Limiting Check (Max 3 score submissions per minute per FID)
    const now = Date.now();
    const timestamps = rateLimits.get(numericFid) || [];
    const recentTimestamps = timestamps.filter((t) => now - t < 60 * 1000);
    if (recentTimestamps.length >= 3) {
      return NextResponse.json(
        { message: "Rate limit exceeded. Maximum 3 submissions per minute." },
        { status: 429 }
      );
    }
    recentTimestamps.push(now);
    rateLimits.set(numericFid, recentTimestamps);

    // 3. Cryptographic Signature & Expiry Check
    if (!verifyGameSession(sessionToken)) {
      return NextResponse.json(
        { message: "Invalid or expired game session token" },
        { status: 403 }
      );
    }

    // 4. Double Spend Prevention (Replay attack protection)
    if (usedSessions.has(sessionToken.sessionId)) {
      return NextResponse.json(
        { message: "Game session token has already been used" },
        { status: 403 }
      );
    }

    // 5. Plausibility Check - Elapsed Time vs Claimed Duration
    const timeElapsed = now - sessionToken.timestamp;
    const durationMs = numericDuration * 1000;
    // Allow a 3-second grace period for network latency and browser rendering differences
    if (timeElapsed < durationMs - 3000) {
      return NextResponse.json(
        { message: "Plausibility check failed: time elapsed is less than claimed game duration" },
        { status: 400 }
      );
    }

    // 6. Plausibility Check - Score vs Duration
    const maxPossible = getMaxPossibleScore(numericDuration);
    if (numericScore > maxPossible) {
      return NextResponse.json(
        { message: `Plausibility check failed: score is higher than the maximum possible for this duration (${maxPossible})` },
        { status: 400 }
      );
    }

    // 7. Plausibility Check - Absolute Score Cap
    if (numericScore > 50000) {
      return NextResponse.json(
        { message: "Plausibility check failed: score exceeds absolute maximum limit" },
        { status: 400 }
      );
    }

    // Mark session token as used
    usedSessions.set(sessionToken.sessionId, sessionToken.timestamp + 15 * 60 * 1000);

    // Forward validated score to Spring Boot backend
    const backendUrl = API_CONFIG.backendUrl;
    const response = await fetch(`${backendUrl}/api/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.BACKEND_API_KEY || "",
      },
      body: JSON.stringify({
        fid: numericFid,
        username: username || `FID:${numericFid}`,
        score: numericScore,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", response.status, errorText);
      return NextResponse.json(
        { message: "Backend submission failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Score submission error:", error);

    // Fallback: accept the score locally if backend is unavailable
    const fallbackFid = requestBody?.fid ?? 0;
    const fallbackScore = requestBody?.score ?? 0;
    return NextResponse.json(
      {
        message: "Score recorded locally (backend unavailable)",
        offline: true,
        fid: fallbackFid,
        score: fallbackScore,
      },
      { status: 201 }
    );
  }
}