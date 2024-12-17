import { parse } from "@/lib/utils";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { AdminMiddleware, BuyerMiddleware, SellerMiddleware } from "./lib/middleware/admin";

export const ADMIN_HOSTNAMES = new Set([
  "admin-tea.vercel.app",
  "admin.localhost:3000",
]);
export const BUYER_HOSTNAMES = new Set(["buyer-tea.vercel.app", "localhost:3000"]);
export const SELLER_HOSTNAMES = new Set([
  "seller-tea.vercel.app",
  "seller.localhost:3000",
]);

export async function middleware(request: NextRequest) {
  const { domain } = parse(request);

  if (BUYER_HOSTNAMES.has(domain)) {
    return BuyerMiddleware(request);
  }

  if (SELLER_HOSTNAMES.has(domain)) {
    return SellerMiddleware(request);
  }

  if (ADMIN_HOSTNAMES.has(domain)) {
    return AdminMiddleware(request);
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
