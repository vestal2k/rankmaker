import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

// POST /api/upload - Upload images to Vercel Blob
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Upload all files to Vercel Blob
    const uploadPromises = files.map(async (file) => {
      const blob = await put(file.name, file, {
        access: "public",
        addRandomSuffix: true, // Prevents name collisions
      });

      return {
        url: blob.url,
        originalName: file.name,
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    return NextResponse.json({ files: uploadedFiles }, { status: 200 });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
