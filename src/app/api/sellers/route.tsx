// app/api/sellers/route.ts
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

    const [sellers, total] = await Promise.all([
      prisma.seller.findMany({
        where: whereClause,
        skip,
        take: pageSize,
      }),
      prisma.seller.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({
      sellers,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching sellers:", error);
    return NextResponse.json(
      { error: "Error fetching sellers" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, updatedFields } = await req.json();
    const updatedSeller = await prisma.seller.update({
      where: { id },
      data: {
        verification_status: status,
        ...updatedFields,
      },
    });

    // Generate password if status is changed to VERIFIED
    if (status === "VERIFIED") {
      const password = Math.random().toString(36).slice(-8);
      await prisma.seller.update({
        where: { id },
        data: { password: password },
      });
      updatedSeller.password = password;
    }

    return NextResponse.json(updatedSeller);
  } catch (error) {
    console.error("Error updating seller:", error);
    return NextResponse.json(
      { error: "Error updating seller" },
      { status: 500 }
    );
  }
}
