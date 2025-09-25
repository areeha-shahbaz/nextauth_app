import { NextResponse } from "next/server";
import connect from "src/dbConnection/dbConnection";
import Product from "src/models/products";
import fs from "fs";

export const runtime = "nodejs";
export async function GET() {
  try {
    await connect();

    const dbProducts = await Product.find();

    const fakestoreRes = await fetch("https://fakestoreapi.com/products");
    const fakestoreProducts = await fakestoreRes.json();

    const merged = [...dbProducts, ...fakestoreProducts];

    return NextResponse.json(merged);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connect();

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const price = Number(formData.get("price"));
    const file = formData.get("image") as File;

    if (!title || !price || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `./public/uploads/${fileName}`;
    await fs.promises.writeFile(filePath, buffer);

    const newProduct = await Product.create({
      title,
      price,
      image: `/uploads/${fileName}`, 
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error("POST /api/products failed", error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}
