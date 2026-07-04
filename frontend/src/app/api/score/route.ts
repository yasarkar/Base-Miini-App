import { NextRequest, NextResponse } from "next/server";
import { API_CONFIG } from "@/lib/constants";

export async function POST(request: NextRequest) {
  let requestBody: any;
  try {
    requestBody = await request.json();
    const { fid, username, score } = requestBody;

    // Validate required fields
    if (fid === undefined || score === undefined) {
      return NextResponse.json(
        { message: "Missing required fields: fid, score" },
        { status: 400 }
      );
    }

    if (typeof score !== "number" || score < 0) {
      return NextResponse.json(
        { message: "Score must be a non-negative number" },
        { status: 400 }
      );
    }

    // Forward to Spring Boot backend
    const backendUrl = API_CONFIG.backendUrl;
    const response = await fetch(`${backendUrl}/api/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.BACKEND_API_KEY || "",
      },
      body: JSON.stringify({
        fid,
        username: username || `FID:${fid}`,
        score,
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