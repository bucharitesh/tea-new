import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(request: Request, context: any) {
  try {
    const body = await request.json();

    const { user_id, tenant, action, password } = body;

    // Validate required fields
    if (!user_id) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    let tenantData: any;

    switch (tenant) {
      case "buyer":
        tenantData = prisma.buyer;
        break;
      case "seller":
        tenantData = prisma.seller;
        break;
      default:
        break;
    }

    const res = await tenantData.update({
      where: {
        user_id: user_id,
      },
      data: {
        isApproved: action,
        password
      },
    });

    return NextResponse.json(res, { status: 201 });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
