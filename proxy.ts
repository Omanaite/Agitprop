import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/ssr";
import { getUserConsoleRoute, isArtistOperator, isPlatformAdmin } from "@/lib/supabase/auth";

export async function proxy(request: NextRequest) {
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

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const isLogin = request.nextUrl.pathname.startsWith("/admin/login");
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

  if (request.nextUrl.pathname.startsWith("/studio")) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (!isArtist) {
      if (consoleRoute) {
        return NextResponse.redirect(new URL(consoleRoute, request.url));
      }
      return NextResponse.redirect(new URL("/admin/login?error=forbidden", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/studio/:path*"],
};
