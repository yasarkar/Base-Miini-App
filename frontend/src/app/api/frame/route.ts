import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Farcaster Frame v2 expects a signed message
    // This endpoint handles frame button clicks
    const { trustedData, untrustedData } = body;

    // Extract the button index from the frame interaction
    const buttonIndex = untrustedData?.buttonIndex || 1;

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
