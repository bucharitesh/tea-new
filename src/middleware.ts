import { parse } from "@/lib/utils";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export const ADMIN_HOSTNAMES = new Set(["admin.localhost:3000"]);
export const BUYER_HOSTNAMES = new Set(["localhost:3000"]);
export const SELLER_HOSTNAMES = new Set(["seller.localhost:3000"]);

export async function middleware(request: NextRequest) {
  const { domain, fullPath } = parse(request);
  const session = await auth();

  const loginUrl = new URL("/login", request.url);
  const dashboardUrl = new URL("/dashboard", request.url);

  const isLoggedIn = !!session?.user;
  const userRole = session?.user?.role;

  if (BUYER_HOSTNAMES.has(domain)) {
    if (!isLoggedIn && fullPath !== "/login") {
      return NextResponse.redirect(loginUrl);
    }
    if (isLoggedIn && fullPath === "/login") {
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.rewrite(new URL(`/buyer${fullPath}`, request.url));
  }

  if (SELLER_HOSTNAMES.has(domain)) {
    if (!isLoggedIn || userRole !== "SELLER") {
      if (fullPath !== "/login") {
        return NextResponse.redirect(loginUrl);
      }
    }
    if (isLoggedIn && userRole === "SELLER" && fullPath === "/login") {
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.rewrite(new URL(`/seller${fullPath}`, request.url));
  }

  if (ADMIN_HOSTNAMES.has(domain)) {
    if (!isLoggedIn || userRole !== "ADMIN") {
      if (fullPath !== "/login") {
        return NextResponse.redirect(loginUrl);
      }
    }
    if (isLoggedIn && userRole === "ADMIN" && fullPath === "/login") {
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.rewrite(new URL(`/admin${fullPath}`, request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
     */
    "/((?!api/|_next/|_proxy/|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};
