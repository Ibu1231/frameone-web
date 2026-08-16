import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { studio } from "@/lib/content";
import "./globals.css";

const grotesk = localFont({
  src: "./fonts/space-grotesk-latin.woff2",
  variable: "--font-grotesk",
  weight: "300 700",
  display: "swap",
  preload: true,
});

const siteUrl = "https://www.frameonehq.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FrameOne — Media Production, Bangalore",
    template: "%s — FrameOne",
  },
  description:
    "FrameOne Global is a Bangalore-based media production company working worldwide across live events, corporate films, fashion, and automotive.",
  openGraph: {
    title: "FrameOne — Media Production, Bangalore",
    description:
      "High-impact visual content across live events, corporate films, fashion, and automotive.",
    url: siteUrl,
    siteName: studio.legalName,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FrameOne — Media Production, Bangalore",
    description:
      "High-impact visual content across live events, corporate films, fashion, and automotive.",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#d9d6d0",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={grotesk.variable}>
      <body>{children}</body>
    </html>
  );
}
