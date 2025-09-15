import { NextResponse } from "next/server";
import connect from "src/dbConnection/dbConnection";
import User from "src/models/userModel";

export async function POST(req: Request) {
  try {
    await connect();
    const { email } = await req.json();

    const user = await User.findOneAndUpdate(
      { email },
      { hasPaid: true },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error marking user as paid", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
