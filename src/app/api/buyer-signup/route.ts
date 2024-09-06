import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request, context: any) {
  try {
    const body = await request.json();

    const { user_id, password } = body;

    // Validate required fields
    if (!user_id) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const business = await prisma.buyer.create({
      data: {
        user_id,
        isApproved: "INITIALISED",
        password,
      },
    });


    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    console.log("error",error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
