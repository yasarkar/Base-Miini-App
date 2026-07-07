import { NextResponse } from 'next/server'

export async function GET() {
  let appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://shelbys-ledger.vercel.app'
  
  // Enforce production URL in production if localhost is set in env
  if (appUrl.includes('localhost') && process.env.NODE_ENV === 'production') {
    appUrl = 'https://shelbys-ledger.vercel.app'
  }

  return NextResponse.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER || 'REPLACE_WITH_HEADER',
      payload: process.env.FARCASTER_PAYLOAD || 'REPLACE_WITH_PAYLOAD',
      signature: process.env.FARCASTER_SIGNATURE || 'REPLACE_WITH_SIGNATURE'
    },
    frame: {
      name: "Shelbys Ledger Birmingham Escape",
      version: "1",
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/og-image.png`,
      buttonTitle: "Play Now",
      splashImageUrl: `${appUrl}/icon.png`,
      splashBackgroundColor: "#0d0d0f",
      webhookUrl: `${appUrl}/api/webhook`,
      description: "Are you ready to outmaneuver the gangs one by one on the foggy streets of Birmingham?",
      subtitle: "Peaky Blinders",
      primaryCategory: "games",
      screenshotUrls: [
        `${appUrl}/og-image.png`
      ],
      heroImageUrl: `${appUrl}/og-image.png`,
      castShareUrl: appUrl,
      ogImageUrl: `${appUrl}/og-image.png`,
      ogDescription: "Help Thomas Shelby escape police blockades and factory pipes in this retro 2D runner!",
      ogTitle: "Shelby's Ledger",
      tagline: "Stand up for Birmingham!",
      tags: [
        "games",
        "runner",
        "retro",
        "peaky-blinders",
        "arcade"
      ]
    }
  })
}
