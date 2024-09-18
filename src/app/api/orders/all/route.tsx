import { OrderStatus } from "@/cart/cart-context";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const page = Number(searchParams.get("page")) || 0;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const status = searchParams.get("status") || null;

  const orders = await prisma.order.findMany({
    skip: page * pageSize,
    take: pageSize,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      items: true,
    },
  });

  const totalOrders = await prisma.order.count();

  const res = {
    data: orders,
    pages: Math.ceil(totalOrders / pageSize),
    totalOrders,
  };

  return NextResponse.json(res);
}