import { parse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth";

export async function AdminMiddleware(req: NextRequest) {
    const { path, fullPath } = parse(req);

    const session = await auth();

    const isLoggedIn = !!session?.user;

    if (!isLoggedIn && path !== "/login") {
      return NextResponse.redirect(
        new URL(`/login`, req.url)
      );
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

  if (path === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  } else if (path !== "/login" && !user) {
    return NextResponse.redirect(new URL(`/login`, req.url));
  }

  return NextResponse.rewrite(new URL(`/seller${fullPath}`, req.url));
}


export async function BuyerMiddleware(req: NextRequest) {
  const { path, fullPath } = parse(req);

  const user = await auth();

  if (path === "/register") {
    return NextResponse.rewrite(new URL(`/buyer${fullPath}`, req.url));
  }

  if (path === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  } else if (path !== "/login" && !user) {
    return NextResponse.redirect(new URL(`/login`, req.url));
  }

  return NextResponse.rewrite(new URL(`/buyer${fullPath}`, req.url));
}