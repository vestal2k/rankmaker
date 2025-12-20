import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/tierlists/public - Get all public tier lists
export async function GET() {
  try {
    const tierlists = await db.tierList.findMany({
      where: { isPublic: true },
      include: {
        user: {
          select: {
            username: true,
            imageUrl: true,
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50, // Limit to 50 most recent
    });

    return NextResponse.json(tierlists);
  } catch (error) {
    console.error("Error fetching public tier lists:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const isDbConfigError = errorMessage.includes("DATABASE_URL");

    return NextResponse.json(
      {
        error: isDbConfigError
          ? "Database not configured"
          : "Failed to fetch tier lists",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: isDbConfigError ? 503 : 500 }
    );
  }
}
