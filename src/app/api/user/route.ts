import { NextRequest, NextResponse } from "next/server";
import connect from "src/dbConnection/dbConnection";
import User from "src/models/userModel";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  status: string;
}

async function authorizeUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (!token) throw new Error("Unauthorized");

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  if (decoded.status !== "active") throw new Error("Deactivated");

  return decoded;
}

export async function GET(req: NextRequest) {
  try {
    await connect();
    const decoded = await authorizeUser(req);

    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 403 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connect();
    const decoded = await authorizeUser(req);

    const { name, email } = await req.json();
    if (!name && !email) {
      return NextResponse.json({ success: false, error: "Nothing to update" }, { status: 400 });
    }

    const user = await User.findById(decoded.id);
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 403 });
  }
}
