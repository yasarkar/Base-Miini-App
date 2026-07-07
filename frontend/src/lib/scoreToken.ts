import crypto from "crypto";

const SECRET = process.env.SCORE_SIGNING_SECRET || "birmingham_shelby_secret_key_1919_ledger_dev";

export interface GameSession {
  sessionId: string;
  timestamp: number;
  signature: string;
}

/**
 * Creates a new signed game session token.
 */
export function createGameSession(): GameSession {
  if (!process.env.SCORE_SIGNING_SECRET && process.env.NODE_ENV === "production") {
    throw new Error("CRITICAL SECURITY ERROR: SCORE_SIGNING_SECRET environment variable is not configured in production!");
  }
  const sessionId = crypto.randomUUID();
  const timestamp = Date.now();
  const dataToSign = `${sessionId}:${timestamp}`;
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(dataToSign)
    .digest("hex");

  return {
    sessionId,
    timestamp,
    signature,
  };
}

/**
 * Verifies that the game session was signed by us and has not expired.
 */
export function verifyGameSession(session: GameSession): boolean {
  if (!process.env.SCORE_SIGNING_SECRET && process.env.NODE_ENV === "production") {
    throw new Error("CRITICAL SECURITY ERROR: SCORE_SIGNING_SECRET environment variable is not configured in production!");
  }
  if (!session || !session.sessionId || !session.timestamp || !session.signature) {
    return false;
  }

  // Verify signature
  const dataToSign = `${session.sessionId}:${session.timestamp}`;
  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(dataToSign)
    .digest("hex");

  if (session.signature !== expectedSignature) {
    return false;
  }

  // Verify expiration (15 minutes)
  const age = Date.now() - session.timestamp;
  if (age < 0 || age > 15 * 60 * 1000) {
    return false;
  }

  return true;
}

/**
 * Calculates the maximum possible score a player could achieve in a given duration (seconds).
 */
export function getMaxPossibleScore(durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;
  
  // Strict maximum rate is 8 points/sec. Let's allow 12 points/sec as a safe buffer.
  const safeMaxRate = 12;
  
  // Add a base buffer of 20 points for very short games
  return Math.ceil(durationSeconds * safeMaxRate) + 20;
}
