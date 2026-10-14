import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_session")?.value;

  const payload = token ? await verifyJWT(token) : null;
  const isAuthenticated = !!payload;

  const isApiRoute = pathname.startsWith("/api/");
  const isPublicApi = pathname === "/api/auth/login";
  const isPublicPage = pathname === "/" || pathname === "/login";

  if (!isAuthenticated) {
    if (isApiRoute && !isPublicApi) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Authentication required" },
        { status: 401 },
      );
    }

    if (!isApiRoute && !isPublicPage) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      if (token) {
        response.cookies.delete("admin_session");
      }
      return response;
    }
  }

  if (isAuthenticated && isPublicPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  if (payload && payload.id) {
    requestHeaders.set("x-admin-id", String(payload.id));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
