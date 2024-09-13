import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const tenant = searchParams.get("tenant") || "admin";
  const filters: any = searchParams.get("filter") || null;
  const search: any = searchParams.get("search") || null;

  console.log("test", filters)

  if (tenant === "admin") {
    const products = await prisma.product.findMany({
      where: {
        verification_status: filters && filters !== "ALL" ? filters: undefined,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

  const filteredSearch = products.filter((each) => search && search !== "" ? each.sellerId.includes(search) : each);
  
  return NextResponse.json(filteredSearch);
  }

  if (tenant === "buyer") {
    const products = await prisma.product.findMany({
      where: {
        verification_status: "VERIFIED",
        grade: filters && filters !== "ALL" ? filters : undefined
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

  const filteredSearch = products.filter((each) => search && search !== "" ? each.sellerId.includes(search) : each);
  
  return NextResponse.json(filteredSearch);
  }

  const products = await prisma.product.findMany({
    where: {
      verification_status: "VERIFIED",
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const filteredSearch = products.filter((each) => search && search !== "" ? each.sellerId.includes(search) : each);

  return NextResponse.json(filteredSearch);
}
