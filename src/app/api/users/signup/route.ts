import connect from "src/dbConnection/dbConnection";
import User from "src/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "src/helpers/mailer";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();
    const { name, email, password } = reqBody; 
    console.log("Signup request body:", reqBody);

     const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters long and include at least one special character."
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      uuid: uuidv4(),
      name,
      email,
      passwordHash: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("Saved user:", savedUser);

    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    return NextResponse.json({
      message: "User registered successfully. Please check your email to verify your account.",
      success: true,
    });
  } catch (error) {
  console.error("Signup error:", error);
  return NextResponse.json(
    { error: (error as Error).message },
    { status: 500 }
  );
  }
}

