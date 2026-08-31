import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only intercept /admin routes
  if (pathname.startsWith("/admin")) {
    // Allow /admin/login freely
    if (pathname === "/admin/login") {
      const session = request.cookies.get("brocode_admin_session")?.value;
      if (session) {
        // Already logged in -> redirect to admin dashboard
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // Check for admin session cookie
    const session = request.cookies.get("brocode_admin_session")?.value;
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
