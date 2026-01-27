import type { Metadata } from "next";
import { Geist_Mono, Space_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/providers";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Fundra | Decentralized Crowdfunding on Solana",
  description: "Launch your campaign in minutes. No middlemen, no borders, no hidden fees. Decentralized crowdfunding powered by Solana blockchain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700,800,900&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistMono.variable} ${spaceMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
