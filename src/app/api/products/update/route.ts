import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const product = await prisma.product.update({
      where: {
        sellerId: body.sellerId,
      },
      data: {
        invoiceNo: body.invoiceNo,
        grade: body.grade,
        pkgs: body.pkgs,
        kgPerBag: body.kgPerBag,
        sampleUsed: body.sampleUsed,
        price: body.price,
        division: body.division,
        score: body.score,
        verification_status: body.verification_status
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
