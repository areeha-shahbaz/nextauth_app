import connect from "src/dbConnection/dbConnection";
import User from "src/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  email: string;
  role:string;
  status:string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
      console.error("Missing MONGODB_URI or JWT_SECRET in environment variables");
      return NextResponse.json(
        { success: false, error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    await connect();

    const { email, password } = (await req.json()) as LoginRequest;
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }
   
    const isMatch = await bcryptjs.compare(password, user.passwordHash || "");
    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }
     if (user.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Account is deactivated. Contact admin." },
        { status: 403 }
      );
    }
    const token = jwt.sign(
      { id: user._id.toString(),
         email: user.email,
        role:user.role,
      status:user.status
     } as JwtPayload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    if (user.mustChangePassword) {
      return NextResponse.json({
        success: true,
        message: "Password reset required",
        mustChangePassword: true,
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          status: user.status,
          mustChangePassword: true,
        },
      });
    }
    return NextResponse.json({
      success: true,
      message: "Login successful",
      mustChangePassword: false,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role:user.role,
        status:user.status,
        profileImage: user.profileImage || "",
        mustChangePassword: false,
      },
    });
   }
  // catch (error) {
  //   console.error("Login error:", error);
  //   return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  // }
  catch (error) {
  console.error("Login error:", error); 
  return NextResponse.json({ success: false, error: (error as Error).message || "Server error" }, { status: 500 });
}

}
