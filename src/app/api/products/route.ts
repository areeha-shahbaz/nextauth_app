import { NextResponse, NextRequest} from "next/server";
import connect from "src/dbConnection/dbConnection";
import Product from "src/models/products";
import fs from "fs";


export async function GET() {
  try {
    await connect();

    const products = await Product.find().lean();

    const normalized = products.map((p: any) => ({
      id: p._id.toString(),       
      title: p.title,
      description: p.description,
      price: p.price,
      category: p.category,
      image: p.image,
    }));

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connect();

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const price = Number(formData.get("price"));
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const file = formData.get("image") as File;

    if (!title || !price || !description || !category || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // save image
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `./public/uploads/${fileName}`;
    await fs.promises.writeFile(filePath, buffer);

    // save product
    const newProduct = await Product.create({
      title,
      price,
      description,
      category,
      image: `/uploads/${fileName}`,
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error("POST /api/products failed", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

