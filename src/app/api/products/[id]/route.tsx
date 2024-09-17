import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request, context: any) {
  const { params } = context;
  const { id } = params;
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const filters: any = searchParams.get("filter") || null;
  const search: any = searchParams.get("search") || null;
  const page: any = searchParams.get("page") || null;
  const pageSize: any = searchParams.get("pageSize") || null;

  const products = await prisma.product.findMany({
    skip: page * Number(pageSize),
    take: Number(pageSize),
    where: {
      sellerId: id,
      verification_status: filters && filters !== "ALL" ? filters : undefined,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const productsForRef = await prisma.product.findMany({
    where: {
      sellerId: id,
      verification_status: filters && filters !== "ALL" ? filters : undefined,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const filteredSearch = products.filter((each) =>
    search && search !== "" ? each.sellerId.includes(search) : each
  );

  const res = {
    data: filteredSearch,
    pages: Math.floor(productsForRef.length / pageSize) + 1,
  };

  return NextResponse.json(res);
}
