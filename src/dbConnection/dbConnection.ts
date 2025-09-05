// import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();
// let isConnected = false;

// const connect = async () => {
//   if (isConnected) return;

//   try {
//     const uri = process.env.MONGODB_URI;
//     if (!uri) throw new Error("MONGODB_URI is not defined in environment variables");

//     await mongoose.connect(uri, { dbName: "myDatabase" });
//     isConnected = true;
//     console.log("MongoDB connected");
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//     throw err;
//   }
// };

// export default connect;


import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache;
}

const cached = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

const connect = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not defined");

    cached.promise = mongoose.connect(uri, { dbName: "myDatabase" }).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

export default connect;
