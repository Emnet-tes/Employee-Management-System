import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const sessionCookieName =
  process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(sessionCookieName)?.value;
  const { pathname } = request.nextUrl;

  const publicPaths = ["/", "/login"];
 
  if (pathname === "/api/login") {
    return NextResponse.next();
  }
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }
 if (pathname.startsWith("/api")) {
    const userAgent = request.headers.get("user-agent");

    // Block if user is accessing directly from browser
    if (userAgent?.includes("Mozilla")) {
      return new NextResponse("Browser access denied", { status: 403 });
    }
  }
  if (publicPaths.includes(pathname)) {
    return NextResponse.next(); 
  }

  if (!token) {
    
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"], 
};
