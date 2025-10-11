// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import connect from "src/dbConnection/dbConnection";
// import Product, { ProductDocument } from "src/models/products";

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   try {
//     await connect();

//     if (!mongoose.Types.ObjectId.isValid(params.id)) {
//       return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
//     }
// const dbProduct = await Product.findById(params.id).lean();

//     // const dbProduct: ProductDocument | null = await Product.findById(params.id).lean();
//     if (!dbProduct) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       id: dbProduct._id.toString(),
//       title: dbProduct.title,
//       description: dbProduct.description,
//       price: dbProduct.price,
//       category: dbProduct.category,
//       image: dbProduct.image,
//     });
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
//   }
// }







import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "src/dbConnection/dbConnection";
import Product from "src/models/products";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ Await the params Promise
    await connect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const dbProduct = await Product.findById(id).lean();
    if (!dbProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: dbProduct._id.toString(),
      title: dbProduct.title,
      description: dbProduct.description,
      price: dbProduct.price,
      category: dbProduct.category,
      image: dbProduct.image,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
