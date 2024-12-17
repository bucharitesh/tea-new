import { parse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth";

export async function AdminMiddleware(req: NextRequest) {
    const { path, fullPath } = parse(req);

    const session = await auth();

    const isLoggedIn = !!session?.user;

    const userTenant = session?.user?.tenant;

    if ((!isLoggedIn || userTenant !== "ADMIN") && path !== "/login") {
      return NextResponse.redirect(
        new URL(`/login`, req.url)
      );
    } else if (path === "/login" && session) {
      return NextResponse.redirect(new URL(`/dashboard`, req.url));
    }

    // otherwise, rewrite the path to /app
    return NextResponse.rewrite(new URL(`/admin${fullPath}`, req.url));
}

export async function SellerMiddleware(req: NextRequest) {
  const { path, fullPath } = parse(req);

  const user = await auth();

  if (path === "/register") {
    return NextResponse.rewrite(new URL(`/seller${fullPath}`, req.url));
  }
  
  const userTenant = user?.user?.tenant;

  if(path !== "/login" && (!user || userTenant !== "SELLER")){
    return NextResponse.redirect(new URL("/login", req.url));
  } else if (path === "/login" && user) {
    return NextResponse.redirect(new URL(`/dashboard`, req.url));
  }

  return NextResponse.rewrite(new URL(`/seller${fullPath}`, req.url));
}


export async function BuyerMiddleware(req: NextRequest) {
  const { path, fullPath } = parse(req);

  const user = await auth();

  const userTenant = user?.user?.tenant;

  if (path === "/register") {
    return NextResponse.rewrite(new URL(`/buyer${fullPath}`, req.url));
  }


  if (path !== "/login" && (!user || userTenant !== "BUYER")) {
    return NextResponse.redirect(new URL("/login", req.url));
  } else if (path === "/login" && user) {
    return NextResponse.redirect(new URL(`/dashboard`, req.url));
  }

  return NextResponse.rewrite(new URL(`/buyer${fullPath}`, req.url));
}