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
            isPublic: true,
            createdAt: true,
            _count: {
              select: { likes: true, comments: true },
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

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
