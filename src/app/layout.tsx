import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans, Playfair_Display, Space_Mono } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const mono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EcoWeaver AI — Cubbon Park Multispecies Ecological Twin",
  description:
    "AI-powered planetary stewardship & urban ecological connectivity platform for Cubbon Park, Bengaluru. Modeling canopy continuity, arboreal corridors, and non-human flourishing.",
  keywords: [
    "Cubbon Park",
    "Bengaluru",
    "Urban Ecology",
    "Multispecies Hackathon",
    "Canopy Connectivity",
    "Grey Slender Loris",
    "Planetary Stewardship",
    "EcoWeaver AI",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body className="antialiased min-h-screen bg-[#FEFAE0] text-[#283618] selection:bg-[#DDA15E] selection:text-[#283618]">
        {children}
      </body>
    </html>
  );
}
