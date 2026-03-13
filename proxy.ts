import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/ssr";

export async function middleware(request: NextRequest) {
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
  const isAdmin = user?.app_metadata?.role === "admin";

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const isLogin = request.nextUrl.pathname.startsWith("/admin/login");
    if (!user && !isLogin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (user && !isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};

