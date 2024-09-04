import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { parse } from "./lib/utils";

export const ADMIN_HOSTNAMES = new Set(["admin.localhost:8888"]);
export const BUYER_HOSTNAMES = new Set(["localhost:8888"]);
export const SELLER_HOSTNAMES = new Set(["seller.localhost:8888"]);

const secret: any = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret, salt: "abcd" });
  const { domain, fullPath } = parse(request);

  if (BUYER_HOSTNAMES.has(domain)) {
    if (token?.role === "BUYER") {
      return NextResponse.rewrite(new URL(`/buyer${fullPath}`, request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (SELLER_HOSTNAMES.has(domain)) {
    if (token?.role === "SELLER") {
      return NextResponse.rewrite(new URL(`/seller${fullPath}`, request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (ADMIN_HOSTNAMES.has(domain)) {
    console.log("test", domain)
    if (token?.role === "ADMIN") {
      return NextResponse.rewrite(new URL(`/admin${fullPath}`, request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/|_next/|_proxy/|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};
