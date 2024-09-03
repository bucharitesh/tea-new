// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname, hostname } = url;

  console.log("hostname", hostname);

  if (hostname === "admin.localhost:3000") {
    url.pathname = `/admin${pathname}`;
  } else if (hostname === "seller.localhost:3000") {
    url.pathname = `/seller${pathname}`;
  }
  // Admin dashboard will use the default routing

  return NextResponse.rewrite(url);
}
