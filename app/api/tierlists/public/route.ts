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
    return NextResponse.json(
      { error: "Failed to fetch tier lists" },
      { status: 500 }
    );
  }
}
