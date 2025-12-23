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
        votes: {
          select: { value: true },
        },
        _count: {
          select: { votes: true, comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50, // Limit to 50 most recent
    });

    // Calculate vote score for each tierlist
    const tierlistsWithScore = tierlists.map((tierlist) => ({
      ...tierlist,
      voteScore: tierlist.votes.reduce((sum, vote) => sum + vote.value, 0),
      votes: undefined, // Remove raw votes from response
    }));

    return NextResponse.json(tierlistsWithScore);
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
