import type { Metadata } from "next";
import { Bebas_Neue, Manrope, Space_Mono, Space_Grotesk, Geist, Geist_Mono } from "next/font/google";
import { getRequestLocale } from "@/lib/request-locale";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

// Global font setup aligned with the brutalist spec (condensed heading + mono body).
const headingFont = Bebas_Neue({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
});

// Mono body font to match the terminal / zine aesthetic in the spec.
const bodyFont = Space_Mono({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const adminFont = Manrope({
  variable: "--font-admin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const marketingDisplay = Space_Grotesk({
  variable: "--font-mkt-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const marketingSans = Geist({
  variable: "--font-mkt-sans",
  subsets: ["latin"],
});

const marketingMono = Geist_Mono({
  variable: "--font-mkt-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Agitprop | Artist Portfolio Platform",
    template: "%s | Agitprop",
  },
  description:
    "Agitprop — artist portfolio, booking, and studio publishing platform.",
  metadataBase: new URL(getSiteUrl()),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "artist portfolio",
    "tattoo artist website",
    "artist booking platform",
    "portfolio builder",
    "studio website",
  ],
  openGraph: {
    title: "Agitprop | Artist Portfolio Platform",
    description:
      "Artist portfolio, booking, and studio publishing platform. Built for Vercel + Supabase.",
    url: "/",
    siteName: "Agitprop",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agitprop | Artist Portfolio Platform",
    description:
      "Artist portfolio, booking, and studio publishing platform.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();

  return (
    <html lang={locale}>
      <body
        className={`${headingFont.variable} ${bodyFont.variable} ${adminFont.variable} ${marketingDisplay.variable} ${marketingSans.variable} ${marketingMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}


