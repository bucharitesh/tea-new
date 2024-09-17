import { getOrderTotal } from "@/lib/utils";
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
  const page: any = searchParams.get("page") || null;
  const pageSize: any = searchParams.get("pageSize") || null;

  if (tenant === "admin") {
    const products = await prisma.product.findMany({
      skip: page * Number(pageSize),
      take: Number(pageSize),
      where: {
        verification_status: filters && filters !== "ALL" ? filters : undefined,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const productsForRef = await prisma.product.findMany({
      where: {
        verification_status: filters && filters !== "ALL" ? filters : undefined,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    let filteredSearch: any = products.filter((each) =>
      search && search !== "" ? each.sellerId.includes(search) : each
    );

    filteredSearch = filteredSearch.map((each: any) => {
      each.total = getOrderTotal(each.pkgs, each.kgPerBag, each.sampleUsed)
      return each;
    })

    const res = {
      data: filteredSearch,
      pages: Math.floor(productsForRef.length / pageSize) + 1,
    };

    return NextResponse.json(res);
  }

  if (tenant === "buyer") {
    const products = await prisma.product.findMany({
      skip: page * Number(pageSize),
      take: Number(pageSize),
      where: {
        verification_status: "VERIFIED",
        grade: filters && filters !== "ALL" ? filters : undefined,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const productsForRef = await prisma.product.findMany({
      where: {
        verification_status: "VERIFIED",
        grade: filters && filters !== "ALL" ? filters : undefined,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    let filteredSearch = products.filter((each) =>
      search && search !== "" ? each.sellerId.includes(search) : each
    );


    filteredSearch = filteredSearch.map((each: any) => {
      each.total = getOrderTotal(each.pkgs, each.kgPerBag, each.sampleUsed)
      return each;
    })

    const res = {
      data: filteredSearch,
      pages: Math.floor(productsForRef.length / pageSize) + 1,
    };

    return NextResponse.json(res);
  }

  const products = await prisma.product.findMany({
    where: {
      verification_status: "VERIFIED",
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const filteredSearch = products.filter((each) =>
    search && search !== "" ? each.sellerId.includes(search) : each
  );

  return NextResponse.json(filteredSearch);
}
