import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    const original = await db.tierList.findUnique({
      where: { id },
      include: {
        tiers: {
          include: {
            items: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!original) {
      return NextResponse.json(
        { error: "Tier list not found" },
        { status: 404 }
      );
    }

    if (!original.isPublic) {
      return NextResponse.json(
        { error: "Cannot use private tier list as template" },
        { status: 403 }
      );
    }

    const newTierlist = await db.tierList.create({
      data: {
        title: original.title,
        description: original.description,
        coverImageUrl: original.coverImageUrl,
        isPublic: false,
        userId: userId || null,
        anonymousId: userId ? null : `anon-${uuidv4()}`,
      },
    });

    const allItems: Array<{
      mediaUrl: string;
      mediaType: string;
      coverImageUrl: string | null;
      embedId: string | null;
      label: string | null;
    }> = [];

    for (const tier of original.tiers) {
      for (const item of tier.items) {
        allItems.push({
          mediaUrl: item.mediaUrl,
          mediaType: item.mediaType,
          coverImageUrl: item.coverImageUrl,
          embedId: item.embedId,
          label: item.label,
        });
      }
    }

    for (const tier of original.tiers) {
      await db.tier.create({
        data: {
          name: tier.name,
          color: tier.color,
          order: tier.order,
          tierListId: newTierlist.id,
        },
      });
    }

    const poolTier = await db.tier.create({
      data: {
        name: "__POOL__",
        color: "#808080",
        order: 9999,
        tierListId: newTierlist.id,
      },
    });

    for (let i = 0; i < allItems.length; i++) {
      const item = allItems[i];
      await db.tierItem.create({
        data: {
          mediaUrl: item.mediaUrl,
          mediaType: item.mediaType as any,
          coverImageUrl: item.coverImageUrl,
          embedId: item.embedId,
          label: item.label,
          order: i,
          tierId: poolTier.id,
        },
      });
    }

    return NextResponse.json({
      id: newTierlist.id,
      message: "Template copied successfully",
    });
  } catch (error) {
    console.error("Error using template:", error);
    return NextResponse.json(
      { error: "Failed to use template" },
      { status: 500 }
    );
  }
}
