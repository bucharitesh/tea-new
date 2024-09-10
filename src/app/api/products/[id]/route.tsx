import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request, context: any) {
  const { params } = context;
  const { id } = params;
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const products = await prisma.product.findMany({
    where: {
      sellerId: id,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  console.log(products);

  return NextResponse.json(products);
}
