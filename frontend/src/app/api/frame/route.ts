import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  try {

    // Farcaster Frame v2 expects a signed message
    // This endpoint handles frame button clicks

    // Generate frame response based on button pressed
    const frameResponse = {
      frames: [
        {
          version: "vNext",
          image: "https://shelbys-ledger.vercel.app/og-image.png",
          buttons: [
            {
              label: "Play Shelby's Ledger",
              action: "link",
              target: "https://shelbys-ledger.vercel.app",
            },
          ],
          postUrl: "https://shelbys-ledger.vercel.app/api/frame",
        },
      ],
    };

    return NextResponse.json(frameResponse);
  } catch (error) {
    console.error("Frame handler error:", error);
    return NextResponse.json(
      { error: "Invalid frame request" },
      { status: 400 }
    );
  }
}
