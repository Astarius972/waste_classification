import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoScan — AI Waste Classification",
  description:
    "Every piece of waste has a story. EcoScan uses AI to detect and classify waste in real time — plastic, paper, metal, glass, and organic — then shows decomposition time, environmental impact, and the right way to dispose of it.",
  keywords: [
    "waste classification",
    "AI waste detection",
    "recycling",
    "YOLOv8",
    "environmental awareness",
    "EcoScan",
  ],
  openGraph: {
    title: "EcoScan — AI Waste Classification",
    description:
      "Point a camera at any object and let AI sort it — from pixels to environmental insight in under a second.",
    type: "website",
    siteName: "EcoScan",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden">{children}</body>
    </html>
  );
}
