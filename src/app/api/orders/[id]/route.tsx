import { OrderStatus } from "@/cart/cart-context";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request, context: any) {
  const { searchParams } = new URL(request.url);
  const { params } = context;
  const { id } = params;

  const tenant = searchParams.get("tenant") || "seller";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const page = Number(searchParams.get("page")) || 0;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const status = searchParams.get("status") || null;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const orders = await prisma.order.findMany({
    skip: page * pageSize,
    take: pageSize,
    where: {
      userId: tenant === "buyer" ? id : undefined,
      items: {
        some: {
          sellerId: tenant === "seller" ? id : undefined,
        },
      },
      status: status !== "ALL" ? status : undefined,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const totalOrders = await prisma.order.count({
    where: {
      userId: tenant === "buyer" ? id : undefined,
      items: {
        some: {
          sellerId: tenant === "seller" ? id : undefined,
        },
      },
      status: status !== "ALL" ? status : undefined,
    },
  });

  const res = {
    data: orders,
    pages: Math.ceil(totalOrders / pageSize),
    totalOrders,
  };

  return NextResponse.json(res);
}