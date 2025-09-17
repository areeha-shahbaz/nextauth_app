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
    if (!uri) {
      console.error("mongodb is not defined in env");
      throw new Error("MONGODB_URI is not defined");
    }
    // cached.promise = mongoose.connect(uri, { dbName: "myDatabase" }).then((m) => m);
    cached.promise = mongoose.connect(uri!).then((m) => m);

  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connect;
