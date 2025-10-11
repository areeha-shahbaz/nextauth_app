// import mongoose, { Schema, model } from "mongoose";

// const ProductSchema = new Schema(
//   {
//     id: { type: String, required: true, unique: true }, 
//     category: { type: String, required: true },
//     title: { type: String, required: true },
//     price: { type: Number, required: true },
//     description: { type: String, required: true },      
//     image: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Product || model("Product", ProductSchema);




import mongoose, { Schema, model, Document } from "mongoose";

// explicitly declare that _id is ObjectId
export interface ProductDocument extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const ProductSchema = new Schema<ProductDocument>(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const Product =
  (mongoose.models.Product as mongoose.Model<ProductDocument>) ||
  model<ProductDocument>("Product", ProductSchema);

export default Product;
