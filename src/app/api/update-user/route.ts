import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import WelcomeEmail from "../../../../emails/welcome-email";

const resend = new Resend(process.env.RESEND_API_KEY);

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
        verification_status: action,
        password,
      },
    });

    const user = await tenantData.findFirst({
      where: {
        user_id: user_id,
      },
    });

    if (action === "VERIFIED") {
      const { error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: ["delivered@resend.dev"],
        subject: "Hello world",
        react: WelcomeEmail({ email: user?.email }),
      });

      if (error) {
        return NextResponse.json({ status: 500 });
      }
    }

    return NextResponse.json(res, { status: 201 });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
