import type { Metadata } from "next";
import { Bebas_Neue, Space_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Akemi Tattoo Manifesto",
  description:
    "Brutalist tattoo portfolio and booking portal for Akemi. Built for Vercel + Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Root layout defines global fonts and language.
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
