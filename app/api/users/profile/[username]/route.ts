import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/users/profile/[username] - Get user profile with tier lists
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const user = await db.user.findUnique({
      where: { username },
      select: {
        username: true,
        imageUrl: true,
        createdAt: true,
        tierlists: {
          where: { isPublic: true },
          select: {
            id: true,
            title: true,
            description: true,
            coverImageUrl: true,
            isPublic: true,
            createdAt: true,
            votes: {
              select: { value: true },
            },
            _count: {
              select: { votes: true, comments: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { tierlists: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate vote scores for each tierlist and total stats
    let totalVoteScore = 0;
    let totalComments = 0;

    const tierlistsWithScore = user.tierlists.map((tierlist) => {
      const voteScore = tierlist.votes.reduce((sum, vote) => sum + vote.value, 0);
      totalVoteScore += voteScore;
      totalComments += tierlist._count.comments;
      return {
        ...tierlist,
        voteScore,
        votes: undefined,
      };
    });

    return NextResponse.json({
      ...user,
      tierlists: tierlistsWithScore,
      stats: {
        totalTierlists: user._count.tierlists,
        totalVoteScore,
        totalComments,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
