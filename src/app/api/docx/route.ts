
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import connect from "src/dbConnection/dbConnection";
import docxModel from "src/models/docxModel";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  await connect();
  try {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const arrayBuffer = await req.arrayBuffer();
  const buffer =Buffer.from(arrayBuffer);
  console.log("Received DOCX for user:", userId, "Size:", arrayBuffer.byteLength);

  const doc= new docxModel({
    user: userId,
    fileName:"uploaded.docx",
    filepath:"uploaded.docx",
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    data: buffer,
  
  }); 
    await doc.save();
  return NextResponse.json({ message: "File saved successfully" });
  }
catch (error) {
    console.error("Error saving DOCX:", error);
    return NextResponse.json({ error: "failed to save the DOCX" }, { status: 500 });
  }
}