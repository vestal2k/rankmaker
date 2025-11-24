import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/tierlists - List all tier lists for the current user
export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user in database
    const user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all tier lists for this user
    const tierlists = await db.tierList.findMany({
      where: { userId: user.id },
      include: {
        tiers: {
          include: {
            items: true,
          },
          orderBy: { order: "asc" },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tierlists);
  } catch (error) {
    console.error("Error fetching tier lists:", error);
    return NextResponse.json(
      { error: "Failed to fetch tier lists" },
      { status: 500 }
    );
  }
}

// POST /api/tierlists - Create a new tier list
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    const clerkUser = await currentUser();

    if (!clerkId || !clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, isPublic, tiers } = body;

    if (!title || !tiers || !Array.isArray(tiers)) {
      return NextResponse.json(
        { error: "Title and tiers are required" },
        { status: 400 }
      );
    }

    // Find or create user in database
    let user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      // Create user if doesn't exist
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

    // Create tier list with tiers and items
    const tierlist = await db.tierList.create({
      data: {
        title,
        description: description || null,
        isPublic: isPublic ?? true,
        userId: user.id,
        tiers: {
          create: tiers.map((tier: any, index: number) => ({
            name: tier.name,
            color: tier.color,
            order: index,
            items: {
              create: (tier.items || []).map((item: any, itemIndex: number) => ({
                imageUrl: item.imageUrl,
                label: item.label || null,
                order: itemIndex,
              })),
            },
          })),
        },
      },
      include: {
        tiers: {
          include: {
            items: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(tierlist, { status: 201 });
  } catch (error) {
    console.error("Error creating tier list:", error);
    return NextResponse.json(
      { error: "Failed to create tier list" },
      { status: 500 }
    );
  }
}
