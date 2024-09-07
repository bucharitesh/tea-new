// app/api/buyers/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "ALL";

  const skip = (page - 1) * pageSize;

  try {
    const whereClause: any = {
      OR: [
        { businessName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { contactNo: { contains: search, mode: "insensitive" } },
      ],
    };

    if (status !== "ALL") {
      if (status === "PENDING") {
        whereClause.verification_status = { in: ["INITIALISED", "PENDING"] };
      } else {
        whereClause.verification_status = status;
      }
    }

    const [buyers, total] = await Promise.all([
      prisma.buyer.findMany({
        where: whereClause,
        skip,
        take: pageSize,
      }),
      prisma.buyer.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({
      buyers,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching buyers:", error);
    return NextResponse.json(
      { error: "Error fetching buyers" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, updatedFields } = await req.json();
    const updatedBuyer = await prisma.buyer.update({
      where: { id },
      data: {
        verification_status: status,
        ...updatedFields,
      },
    });

    // Generate password if status is changed to VERIFIED
    if (status === "VERIFIED") {
      const password = Math.random().toString(36).slice(-8);
      await prisma.buyer.update({
        where: { id },
        data: { password: password },
      });
      updatedBuyer.password = password;
    }

    return NextResponse.json(updatedBuyer);
  } catch (error) {
    console.error("Error updating buyer:", error);
    return NextResponse.json(
      { error: "Error updating buyer" },
      { status: 500 }
    );
  }
}
