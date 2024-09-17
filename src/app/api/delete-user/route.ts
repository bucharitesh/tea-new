import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import WelcomeEmail from "../../../../emails/welcome-email";

const resend = new Resend(process.env.RESEND_API_KEY);

const prisma = new PrismaClient();

export async function PATCH(request: Request, context: any) {
  try {
    const body = await request.json();

    const { user_id, tenant, password } = body;

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
        verification_status: "REJECTED",
        password,
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
