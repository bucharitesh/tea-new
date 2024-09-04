import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request, context: any) {
  try {
    const { email, password, role } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    if (role !== "ADMIN") {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return NextResponse.json(
          { message: "Invalid email or password" },
          { status: 401 },
        );
      }

      if (password !== user.password || role !== user.role) {
        return NextResponse.json(
          { message: "Invalid email or password" },
          { status: 401 },
        );
      }

      // If the credentials are correct, you can proceed with further actions,
      // like creating a session or returning a JWT token.
      return NextResponse.json(
        { message: "Login successful" },
        { status: 200 },
      );
    } else {
      if (email !== "bucha@flamapp.com" || password !== "plmplmplm")
        return NextResponse.json(
          { message: "Invalid email or password" },
          { status: 401 },
        );
        
      return NextResponse.json(
        { message: "Login successful" },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
