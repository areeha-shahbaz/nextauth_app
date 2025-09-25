import mongoose, { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, 
  },
  { timestamps: true }
);

export default mongoose.models.Product || model("Product", ProductSchema);
