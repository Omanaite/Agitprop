import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: (() => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!url) {
        return [];
      }

      const hostname = new URL(url).hostname;
      return [
        {
          protocol: "https",
          hostname,
          pathname: "/storage/v1/object/public/**",
        },
      ];
    })(),
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseOrigin = supabaseUrl
      ? new URL(supabaseUrl).origin
      : undefined;
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : "script-src 'self' 'unsafe-inline'";
    const scriptSrcElem = isDev
      ? "script-src-elem 'self' 'unsafe-inline' https://vercel.live"
      : "script-src-elem 'self' 'unsafe-inline' https://vercel.live";
    const styleSrc = isDev
      ? "style-src 'self' 'unsafe-inline'"
      : "style-src 'self' 'unsafe-inline'";
    const connectSrcValues = ["'self'", "https://vercel.live"];
    if (supabaseOrigin) {
      connectSrcValues.push(supabaseOrigin);
    }
    const csp =
      "default-src 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; img-src 'self' data: https:; " +
      styleSrc +
      "; " +
      scriptSrc +
      "; " +
      scriptSrcElem +
      "; connect-src " +
      connectSrcValues.join(" ") +
      "; font-src 'self' data: https:; frame-ancestors 'none';";

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
