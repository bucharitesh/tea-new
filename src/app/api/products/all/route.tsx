import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const tenant = searchParams.get("tenant") || "admin";

  if (tenant === "admin") {
    const products = await prisma.product.findMany({
      where: {
        verification_status: "PENDING",
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return NextResponse.json(products);
  }

  const products = await prisma.product.findMany({
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  return NextResponse.json(products);
}
