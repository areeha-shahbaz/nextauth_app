// import connect from "src/dbConnection/dbConnection";
// import User from "src/models/userModel";
// import { NextRequest, NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken";

// interface JwtPayload {
//   id: string;
//   email: string;
// }

// interface LoginRequest {
//   email: string;
//   password: string;
// }

// export async function POST(req: NextRequest) {
//   if (!process.env.MONGODB_URI) {
//   console.error(" Missing MONGODB_URI in Vercel env");
// }
// if (!process.env.JWT_SECRET) {
//   console.error("Missing JWT_SECRET in Vercel env");
// }
//   await connect();

//   try {
//     const { email, password } = (await req.json()) as LoginRequest;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: "User not found" },
//         { status: 404 }
//       );
//     }

//     const isMatch = await bcryptjs.compare(password, user.passwordHash);
//     if (!isMatch) {
//       return NextResponse.json(
//         { success: false, error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     const token = jwt.sign(
//       { id: user._id.toString(), email: user.email } as JwtPayload,
//       process.env.JWT_SECRET!,
//       { expiresIn: "1h" }
//     );

//     return NextResponse.json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id.toString(),
//         name: user.name,
//         email: user.email,
//         profileImage: user.profileImage || "",
//       },
//     });

//   }  
 
//   catch (error) {
//     console.error("Login error:", error);
//     return NextResponse.json(
//       { success: false, error: "Server error" },
//       { status: 500 }
//     );
//   }

// }

import connect from "src/dbConnection/dbConnection";
import User from "src/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  email: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    // Step 1: Check environment variables
    if (!process.env.MONGODB_URI) {
      console.error("Missing MONGODB_URI in Vercel env");
      return NextResponse.json(
        { success: false, error: "Server misconfiguration" },
        { status: 500 }
      );
    }
    if (!process.env.JWT_SECRET) {
      console.error("Missing JWT_SECRET in Vercel env");
      return NextResponse.json(
        { success: false, error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    // Step 2: Connect to DB
    await connect();

    // Step 3: Parse request
    const { email, password } = (await req.json()) as LoginRequest;
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Step 4: Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Step 5: Check password
    if (!user.passwordHash) {
      console.error("User missing passwordHash in DB", user._id.toString());
      return NextResponse.json(
        { success: false, error: "User cannot log in" },
        { status: 500 }
      );
    }

    const isMatch = await bcryptjs.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Step 6: Sign JWT
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email } as JwtPayload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Step 7: Respond success
    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || "",
      },
    });

  } 
   catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

