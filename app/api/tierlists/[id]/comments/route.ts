import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const clerkUser = await currentUser();

    if (!clerkId || !clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    let user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          clerkId,
          username:
            clerkUser.username ||
            clerkUser.emailAddresses[0]?.emailAddress.split("@")[0] ||
            `user_${clerkId}`,
          email:
            clerkUser.emailAddresses[0]?.emailAddress || `${clerkId}@temp.com`,
          imageUrl: clerkUser.imageUrl,
        },
      });
    }

    const comment = await db.comment.create({
      data: {
        content: content.trim(),
        userId: user.id,
        tierListId: id,
      },
      include: {
        user: {
          select: {
            username: true,
            imageUrl: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
