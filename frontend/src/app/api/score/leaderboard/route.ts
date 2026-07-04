import { NextRequest, NextResponse } from "next/server";
import { API_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "10";

    // Forward to Spring Boot backend
    const backendUrl = API_CONFIG.backendUrl;
    const response = await fetch(
      `${backendUrl}/api/scores/leaderboard?limit=${limit}`,
      {
        headers: {
          "X-API-Key": process.env.BACKEND_API_KEY || "",
        },
        next: { revalidate: 30 }, // Cache for 30 seconds
      }
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    // Fallback: return empty leaderboard
    console.warn("Backend unavailable, returning empty leaderboard");
    return NextResponse.json([]);
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json([], { status: 200 });
  }
}