import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

// POST /api/upload/client-token - Handle client-side uploads for large files (videos, etc.)
export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Validate the file type
        const allowedTypes = [
          "image/",
          "video/",
          "audio/",
        ];

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "video/mp4",
            "video/webm",
            "video/quicktime",
            "video/x-msvideo",
            "audio/mpeg",
            "audio/wav",
            "audio/ogg",
            "audio/webm",
          ],
          maximumSizeInBytes: 100 * 1024 * 1024, // 100MB max for videos
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Called after the file is uploaded
        console.log("Upload completed:", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Error handling client upload:", error);
    return NextResponse.json(
      { error: "Failed to handle upload" },
      { status: 500 }
    );
  }
}
