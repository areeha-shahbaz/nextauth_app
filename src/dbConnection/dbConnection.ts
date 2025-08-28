import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
let isConnected = false;

const connect = async () => {
  if (isConnected) return;

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not defined in environment variables");

    await mongoose.connect(uri, { dbName: "myDatabase" });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

export default connect;
