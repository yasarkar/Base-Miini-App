import { NextRequest, NextResponse } from "next/server";

/**
 * GET: Basic health check / ping verification for the webhook.
 */
export async function GET() {
  return NextResponse.json({ status: "active", service: "Farcaster Webhook" }, { status: 200 });
}

/**
 * POST: Handles incoming Farcaster event notifications (install, uninstall, etc.).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Farcaster webhook event received:", JSON.stringify(body, null, 2));

    // Respond with a 200 OK as required by Farcaster event delivery specs
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing Farcaster webhook:", error);
    return NextResponse.json(
      { error: "Invalid payload or formatting" },
      { status: 400 }
    );
  }
}
