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
  title: {
    default: "Artopia | Akemi Tattoo Pilot",
    template: "%s | Artopia",
  },
  description:
    "Artopia platform pilot: brutalist tattoo portfolio and booking portal for Akemi.",
  metadataBase: new URL(getSiteUrl()),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "tattoo artist berlin",
    "tattoo portfolio",
    "blackwork tattoos",
    "fine line tattoo berlin",
    "akemi tattoo",
  ],
  openGraph: {
    title: "Artopia | Akemi Tattoo Pilot",
    description:
      "Brutalist tattoo portfolio and booking portal for Akemi. Built for Vercel + Supabase.",
    url: "/",
    siteName: "Artopia",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artopia | Akemi Tattoo Pilot",
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

