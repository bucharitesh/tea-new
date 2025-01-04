// app/api/orders/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId, cartItems, delCharges, othCharges } = await request.json();

    if (!userId || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: cartItems.reduce(
          (sum, item) =>
            sum +
            item.price *
              (item.pkgs * item.kgPerBag -
                item.sampleUsed) *
              item.quantity,
          0
        ),
        status: "PENDING",
        items: cartItems,
        delCharges,
        othCharges,
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
