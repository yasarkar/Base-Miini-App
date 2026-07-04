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

export const metadata: Metadata = {
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
    "fc:frame": "vNext",
    "fc:frame:image": "https://shelbys-ledger.vercel.app/og-image.png",
    "fc:frame:button:1": "Play Shelby's Ledger",
    "fc:frame:post_url": "https://shelbys-ledger.vercel.app/api/frame",
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