import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Helper function to generate lot number
async function generateLotNumber(): Promise<string> {
  const date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");

  // Calculate financial year
  let financialYear: string;
  if (date.getMonth() + 1 >= 4) {
    // If month is April or later
    financialYear =
      date.getFullYear().toString().slice(-2) +
      (date.getFullYear() + 1).toString().slice(-2);
  } else {
    financialYear =
      (date.getFullYear() - 1).toString().slice(-2) +
      date.getFullYear().toString().slice(-2);
  }

  // Get the latest lot number for current financial year
  const latestProduct = await prisma.product.findFirst({
    where: {
      lotNo: {
        startsWith: financialYear,
      },
    },
    orderBy: {
      lotNo: "desc",
    },
  });

  let serialNumber = "0001";
  if (latestProduct && latestProduct.lotNo) {
    const currentSerial = parseInt(latestProduct.lotNo.slice(-4));
    serialNumber = (currentSerial + 1).toString().padStart(4, "0");
  }

  return `${financialYear}${month}${serialNumber}`;
}

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
    const lotNo = await generateLotNumber();

    console.log("body", body)

    const product = await prisma.product.create({
      data: {
        lotNo,
        mark: String(body.mark),
        sellerId: body.sellerId,
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

    // Remove lotNo from updateData if it exists
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { lotNo, ...finalUpdateData } = updateData;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: finalUpdateData,
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
