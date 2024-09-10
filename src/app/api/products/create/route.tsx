import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const search = searchParams.get("search") || "";
  const minPrice = Number(searchParams.get("minPrice")) || undefined;
  const maxPrice = Number(searchParams.get("maxPrice")) || undefined;

  const products = await prisma.product.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                // { invoiceNo: { contains: search } },
                // { grade: { contains: search } },
                { verification_status: { contains: search } },
              ],
            }
          : {},
        minPrice ? { price: { gte: minPrice } } : {},
        maxPrice ? { price: { lte: maxPrice } } : {},
      ],
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        sellerId: body.sellerId, // You'll need to handle authentication and get the sellerId
        invoiceNo: body.invoiceNo,
        grade: body.grade,
        pkgs: body.pkgs,
        kgPerBag: body.kgPerBag,
        sampleUsed: body.sampleUsed,
        price: body.price,
        division: body.division,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
