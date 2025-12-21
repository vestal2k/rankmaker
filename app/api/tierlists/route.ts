import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/tierlists - List all tier lists for the current user
export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    const anonymousId = request.headers.get("x-anonymous-id");

    // If authenticated, get user's tierlists
    if (clerkId) {
      const user = await db.user.findUnique({
        where: { clerkId },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

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
    }

    // If not authenticated but has anonymousId, get anonymous tierlists
    if (anonymousId) {
      const tierlists = await db.tierList.findMany({
        where: { anonymousId },
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
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const body = await request.json();
    const { title, description, coverImageUrl, isPublic, tiers, anonymousId } = body;

    if (!title || !tiers || !Array.isArray(tiers)) {
      return NextResponse.json(
        { error: "Title and tiers are required" },
        { status: 400 }
      );
    }

    // Public tierlists require authentication
    if (isPublic && !clerkId) {
      return NextResponse.json(
        { error: "Authentication required to publish public tier lists" },
        { status: 401 }
      );
    }

    // If authenticated, create with user
    if (clerkId && clerkUser) {
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

      const tierlist = await db.tierList.create({
        data: {
          title,
          description: description || null,
          coverImageUrl: coverImageUrl || null,
          isPublic: isPublic ?? true,
          userId: user.id,
          tiers: {
            create: tiers.map((tier: any, index: number) => ({
              name: tier.name,
              color: tier.color,
              order: index,
              items: {
                create: (tier.items || []).map((item: any, itemIndex: number) => ({
                  mediaUrl: item.mediaUrl,
                  mediaType: item.mediaType || "IMAGE",
                  coverImageUrl: item.coverImageUrl || null,
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
    }

    // Anonymous user - create private tierlist with anonymousId
    if (!anonymousId) {
      return NextResponse.json(
        { error: "Anonymous ID is required for unauthenticated users" },
        { status: 400 }
      );
    }

    const tierlist = await db.tierList.create({
      data: {
        title,
        description: description || null,
        coverImageUrl: coverImageUrl || null,
        isPublic: false, // Always private for anonymous users
        anonymousId,
        tiers: {
          create: tiers.map((tier: any, index: number) => ({
            name: tier.name,
            color: tier.color,
            order: index,
            items: {
              create: (tier.items || []).map((item: any, itemIndex: number) => ({
                mediaUrl: item.mediaUrl,
                mediaType: item.mediaType || "IMAGE",
                coverImageUrl: item.coverImageUrl || null,
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
