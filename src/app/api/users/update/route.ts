import connect from "src/dbConnection/dbConnection";
import User from "src/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload as JWT } from "jsonwebtoken";

interface JwtPayload extends JWT {
  id: string;
  email: string;
}

interface UpdateProfileRequest {
  name: string;
  email: string;
  profileImage: string;
}

export async function PUT(req: NextRequest) {
  await connect();

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const { name, email, profileImage } = (await req.json()) as UpdateProfileRequest;

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Update user fields
    user.name = name;
    user.email = email;
    user.profileImage = profileImage;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || "",
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
