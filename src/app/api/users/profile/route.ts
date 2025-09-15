import { NextRequest, NextResponse } from "next/server";
import User from "src/models/userModel";
import connect from "src/dbConnection/dbConnection";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}
export async function GET(req: NextRequest) {
 
  try {
    await connect();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      console.log(" the user does not exist ")
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
       user:{
      id: user._id,
      name: user.name,
      email:user.email,
      role:user.role,
      status:user.status,
      profileImage:user.profileImage,
      hasPaid: user.hasPaid,
    } });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }

}
