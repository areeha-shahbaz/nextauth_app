import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;           
export const maxBodySize = 10 * 1024 * 1024; 

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY missing in environment variables");
      return NextResponse.json(
        { error: "Server misconfiguration: GEMINI_API_KEY missing" },
        { status: 500 }
      );
    }
    const form = await req.formData();
    const file = form.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Image not provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const body = {
      contents: [
        {
          parts: [
            { text: "Describe the image in a few words" },
            {
              inline_data: {
                mime_type: file.type,
                data: base64Image,
              },
            },
          ],
        },
      ],
    };
    const res = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.error?.message || "Gemini API error" },
        { status: 500 }
      );
    }

    const data = await res.json();
    const caption =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No caption generated";

    return NextResponse.json({ caption });
  } catch (error: unknown) {
    console.error("Image analyzer error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Server error of image analyzer",
      },
      { status: 500 }
    );
  }
}
export const config = {
  api: {
    bodyParser: false,    
    sizeLimit: '10mb',    
  },
};
