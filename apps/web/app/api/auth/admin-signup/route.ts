import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request, context: any) {
  try {
    const body = await request.json();

    const { name, email, password, contactNo } = body;

    // Validate required fields
    if (!name || !contactNo || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Generate buyerId using some logic based on primary key (e.g., auto-generated ID)
    const lastRecord = await prisma.business.findMany({
      orderBy: { id: "desc" },
      take: 1,
    });

    const newBuyerId = lastRecord.length > 0 ? `${lastRecord[0].id + 1}` : `1`;

    const business = await prisma.business.create({
      data: {
        name,
        contactNo,
        email,
        password,
        role: "ADMIN"
      },
    });

    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
