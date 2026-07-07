import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shelbys-ledger.vercel.app";

    // Farcaster Frame v2 expects a signed message
    // This endpoint handles frame button clicks

    // Generate frame response based on button pressed
    const frameResponse = {
      frames: [
        {
          version: "vNext",
          image: `${appUrl}/og-image.png`,
          buttons: [
            {
              label: "Play Shelby's Ledger",
              action: "link",
              target: appUrl,
            },
          ],
          postUrl: `${appUrl}/api/frame`,
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
