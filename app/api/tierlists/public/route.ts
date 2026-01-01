import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const revalidate = 1800;

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
      take: 50,
    });

    const tierlistsWithScore = tierlists.map((tierlist) => ({
      ...tierlist,
      voteScore: tierlist.votes.reduce((sum, vote) => sum + vote.value, 0),
      votes: undefined,
    }));

    return NextResponse.json(tierlistsWithScore, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
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
