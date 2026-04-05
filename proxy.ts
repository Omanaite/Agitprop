import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/ssr";
import { getUserConsoleRoute, isArtistOperator, isPlatformAdmin } from "@/lib/supabase/auth";

// Hostnames that are never treated as custom tenant domains.
const PLATFORM_HOST = process.env.NEXT_PUBLIC_PLATFORM_HOST ?? "";
function isPlatformHost(hostname: string) {
  if (!hostname || hostname === "localhost") return true;
  if (hostname.endsWith(".vercel.app")) return true;
  if (PLATFORM_HOST && hostname === PLATFORM_HOST) return true;
  return false;
}

async function resolveCustomDomain(hostname: string): Promise<string | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  try {
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
    const { data } = await client
      .from("artist_tenants")
      .select("slug")
      .eq("custom_domain", hostname)
      .eq("status", "active")
      .maybeSingle();
    return (data as { slug: string } | null)?.slug ?? null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0];

  // ── Custom domain resolution ─────────────────────────────────────────────
  // Requests arriving on a non-platform hostname are resolved to /{slug} so
  // the artist tenant page is served transparently under their own domain.
  if (!isPlatformHost(hostname)) {
    const slug = await resolveCustomDomain(hostname);
    if (slug) {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = pathname === "/" ? `/${slug}` : `/${slug}${pathname}`;
      return NextResponse.rewrite(rewriteUrl);
    }
  }

  // ── Auth guard ────────────────────────────────────────────────────────────
  const response = NextResponse.next();

  const supabase = createSupabaseServerClient({
    getAll: () => request.cookies.getAll(),
    setAll: (cookies) => {
      cookies.forEach((cookie) => {
        response.cookies.set(cookie);
      });
    },
  });

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const isAdmin = user ? isPlatformAdmin(user) : false;
  const isArtist = user ? isArtistOperator(user) : false;
  const consoleRoute = user ? getUserConsoleRoute(user) : null;

  if (pathname.startsWith("/admin")) {
    const isLogin = pathname.startsWith("/admin/login");
    if (!user && !isLogin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (user && !isAdmin && !isLogin) {
      if (consoleRoute) {
        return NextResponse.redirect(new URL(consoleRoute, request.url));
      }
      return NextResponse.redirect(new URL("/admin/login?error=forbidden", request.url));
    }
  }

  if (pathname.startsWith("/studio")) {
    const isStudioLogin = pathname.startsWith("/studio/login");
    if (!user) {
      if (!isStudioLogin) {
        return NextResponse.redirect(new URL("/studio/login", request.url));
      }
      return response;
    }
    if (!isArtist && !isStudioLogin) {
      // Platform admins landing on /studio get sent to their console (/admin).
      if (consoleRoute) {
        return NextResponse.redirect(new URL(consoleRoute, request.url));
      }
      return NextResponse.redirect(new URL("/studio/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Auth guard for protected consoles.
    "/admin/:path*",
    "/studio/:path*",
    // Custom domain resolution: all non-asset paths.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)",
  ],
};
