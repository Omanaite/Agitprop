import type { Metadata } from "next";
import { Bebas_Neue, Manrope, Space_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Akemi Tattoo Manifesto",
  description:
    "Brutalist tattoo portfolio and booking portal for Akemi. Built for Vercel + Supabase.",
  metadataBase: new URL(getSiteUrl()),
  keywords: [
    "tattoo artist berlin",
    "tattoo portfolio",
    "blackwork tattoos",
    "fine line tattoo berlin",
    "akemi tattoo",
  ],
  openGraph: {
    title: "Akemi Tattoo Manifesto",
    description:
      "Brutalist tattoo portfolio and booking portal for Akemi. Built for Vercel + Supabase.",
    url: "/",
    siteName: "Akemi Tattoo Manifesto",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akemi Tattoo Manifesto",
    description:
      "Brutalist tattoo portfolio and booking portal for Akemi. Built for Vercel + Supabase.",
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
        className={`${headingFont.variable} ${bodyFont.variable} ${adminFont.variable}`}
      >
        {children}
      </body>
    </html>
  );
}

