import connect from "src/dbConnection/dbConnection";
import User from "src/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

// import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import jwt from "jsonwebtoken";

async function getUserFromJWT(authHeader: string | undefined) {
  if (!authHeader) {
    console.error("No Authorization header provided");
    return null;
  }

  // Expecting header in the format "Bearer <token>"
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  if (!token) {
    console.error("No token found in Authorization header");
    return null;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

const uid = payload.userId || payload.id; 
if (!uid) {
  console.error("Token payload missing userId/id");
  return null;
  //  if (!payload.userId) {
  //     console.error("Token payload missing userId");
  //     return null;
  //   }
}

const user = await User.findById(uid);
    // const user = await User.findById(payload.userId);
    if (!user) {
      console.error(`User not found for ID: ${payload.userId}`);
      return null;
    }

    return user;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error("JWT token has expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error("Invalid JWT token:", error.message);
    } else {
      console.error("Unexpected error verifying JWT:", error);
    }
    return null;
  }
}

export async function POST(req: NextRequest) {
  await connect();

  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const { newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Token and password are required" },
        { status: 400 }
      );
    }

    let user = null;
if (/^[0-9a-fA-F]{24}$/.test(token)) {
  user = await User.findById(token);
}
else {
  console.log("Token",token)
  user = await getUserFromJWT(token);
    console.log("user",user)

}
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 400 }
      );
    }
    user.passwordHash = await bcryptjs.hash(newPassword, 10);
    // if (user.forgotPasswordToken) {
      user.forgotPasswordToken = undefined;
      user.forgotPasswordTokenExpiry = undefined;
      user.mustChangePassword = false;
    // }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error: unknown) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 }
    );
  }
}

