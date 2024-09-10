import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request, context: any) {
  try {
    const body = await request.json();

    const {
      user_id,
      email,
      businessName,
      address,
      pincode,
      district,
      state,
      name,
      contactNo,
      alternateContactNo,
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
      !user_id ||
      !email
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const business = await prisma.buyer.create({
      data: {
        user_id,
        email,
        businessName,
        address,
        pincode,
        district,
        state,
        name,
        contactNo,
        alternateContactNo,
        panNo,
        gstNo,
        fssaiNo,
        tmcoNo,
        bankAccountNo,
        ifscCode,
        nameOfTransport,
        verification_status: "INITIALISED",
      },
    });

    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
