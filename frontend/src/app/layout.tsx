import type { Metadata } from "next";
import { Inter, Roboto_Mono, Press_Start_2P, Cinzel } from "next/font/google";
import "./globals.css";
import { WagmiProvider } from "@/providers/WagmiProvider";

const interSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shelbys-ledger.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Shelby's Ledger: Birmingham Escape",
  description:
    "A 2D infinite runner game featuring Thomas Shelby. Dodge factory pipes and police blockades through the streets of Birmingham.",
  openGraph: {
    title: "Shelby's Ledger: Birmingham Escape",
    description:
      "Can you help Thomas Shelby escape Birmingham? Play the infinite runner mini app on Farcaster!",
    images: ["/og-image.png"],
  },
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `${appUrl}/og-image.png`,
      button: {
        title: "Play Shelby's Ledger",
        action: {
          type: "launch_frame",
          name: "Shelby's Ledger",
          url: appUrl,
          splashImageUrl: `${appUrl}/icon.png`,
          splashBackgroundColor: "#0d0d0f"
        }
      }
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interSans.variable} ${robotoMono.variable} ${pressStart2P.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <WagmiProvider>{children}</WagmiProvider>
      </body>
    </html>
  );
}