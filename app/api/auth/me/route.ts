import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";

export async function GET() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        imageUrl: user.imageUrl,
      },
    });
  } catch (error) {
    console.error("Error getting current user:", error);
    return NextResponse.json({ user: null });
  }
}
