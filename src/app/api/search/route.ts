import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;          
const GEMINI_API_URL ="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

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
const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }
    const body = {

    "contents": [
        {
        "parts": [{text:query}],
        }
    ]
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
    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No caption generated";

    return NextResponse.json({ answer});
  } catch (error: unknown) {
    console.error("Image analyzer error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Server error of search ai",
      },
      { status: 500 }
    );
  }
}