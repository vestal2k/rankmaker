import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/tierlists/[id]/like - Like a tier list
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find user in database
    const user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already liked
    const existingLike = await db.like.findUnique({
      where: {
        userId_tierListId: {
          userId: user.id,
          tierListId: id,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { error: "Already liked" },
        { status: 400 }
      );
    }

    // Create like
    await db.like.create({
      data: {
        userId: user.id,
        tierListId: id,
      },
    });

    return NextResponse.json({ message: "Liked successfully" });
  } catch (error) {
    console.error("Error liking tier list:", error);
    return NextResponse.json(
      { error: "Failed to like tier list" },
      { status: 500 }
    );
  }
}

// DELETE /api/tierlists/[id]/like - Unlike a tier list
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find user in database
    const user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete like
    await db.like.delete({
      where: {
        userId_tierListId: {
          userId: user.id,
          tierListId: id,
        },
      },
    });

    return NextResponse.json({ message: "Unliked successfully" });
  } catch (error) {
    console.error("Error unliking tier list:", error);
    return NextResponse.json(
      { error: "Failed to unlike tier list" },
      { status: 500 }
    );
  }
}
