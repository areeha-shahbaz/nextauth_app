import {NextResponse,NextRequest} from "next/server";
 
export const runtime="nodejs";

const GEMINI_API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
// const GEMNI_API_KEY=process.env.GEMNI_API_URL;
export async function POST(req: NextRequest){
try{
    const form = await req.formData();
    const file =form.get("image") as File | null;
    if(!file){
        return NextResponse.json({error:"image not provided"}, 
            {status:400});
    }
    if(!file.type.startsWith("image/")){
        return NextResponse.json({error:"file must be the image"}, 
            {status:400});
    }
    const arraybuffer = await file.arrayBuffer();
    const base64Image= Buffer.from(arraybuffer).toString("base64");

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

 const res= await fetch(GEMINI_API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
   "X-goog-api-key": process.env.GEMINI_API_KEY || "",
  },
  body: JSON.stringify(body),

  });
    if(!res.ok){
    const errorData = await res.json();
    return NextResponse.json({ error: errorData.error?.message || "Gemini API error" }, { status: 500 });
    }

  const data = await res.json();
  const caption =
  data?.candidates?.[0]?.content?.parts?.[0]?.text || "No caption generated";

  return NextResponse.json({caption});
}
    catch (error: unknown) {
  console.error("Image analyzer error:", error);
  return NextResponse.json(
    {
      success: false,
      message:
        error instanceof Error ? error.message : "Server error of image analyzer",
    },
    { status: 500 }
  );
}
}