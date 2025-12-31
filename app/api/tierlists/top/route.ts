import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "6");

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
    });

    const tierlistsWithScore = tierlists
      .map((tierlist) => ({
        ...tierlist,
        voteScore: tierlist.votes.reduce((sum, vote) => sum + vote.value, 0),
        votes: undefined,
      }))
      .sort((a, b) => b.voteScore - a.voteScore)
      .slice(0, limit);

    return NextResponse.json(tierlistsWithScore);
  } catch (error) {
    console.error("Error fetching top tier lists:", error);
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
