import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request, context: any) {
  try {
    const body = await request.json();

    const {
      name,
      password,
      address,
      pincode,
      district,
      state,
      contactNo,
      alternateContactNo,
      email,
      panNo,
      gstNo,
      fssaiNo,
      tmcoNo,
      bankAccountNo,
      ifscCode,
      nameOfTransport,
    } = body;

    // Validate required fields
    if (
      !name ||
      !password ||
      !address ||
      !pincode ||
      !district ||
      !state ||
      !contactNo ||
      !email ||
      !panNo ||
      !gstNo ||
      !bankAccountNo ||
      !ifscCode ||
      !nameOfTransport
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Generate buyerId using some logic based on primary key (e.g., auto-generated ID)
    const lastRecord = await prisma.user.findMany({
      orderBy: { id: "desc" },
      take: 1,
    });

    const newBuyerId = lastRecord.length > 0 ? `${lastRecord[0].id + 1}` : `1`;

    const business = await prisma.user.create({
      data: {
        name,
        password,
        address,
        pincode,
        district,
        state,
        contactNo,
        alternateContactNo,
        email,
        panNo,
        gstNo,
        fssaiNo,
        tmcoNo,
        bankAccountNo,
        ifscCode,
        nameOfTransport,
        buyerId: newBuyerId,
        role: "BUYER",
        businessName: "",
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
