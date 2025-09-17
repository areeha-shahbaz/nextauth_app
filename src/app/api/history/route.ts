import { NextRequest, NextResponse } from "next/server";
import connect from "src/dbConnection/dbConnection";
import mongoose from "mongoose";
import RouteHistory from "src/models/routeHistory";
import User from "src/models/userModel"; 
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  await connect();

  const { userId, from, to } = await req.json();

  if (!userId || !from || !to) {
    return new Response(
      JSON.stringify({ error: "Missing fields" }),
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return new Response(
      JSON.stringify({ error: "Invalid userId" }),
      { status: 400 }
    );
  }

  try {
    const userExists = await User.findById(userId);
    if (!userExists) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }
    const history = new RouteHistory({
      user: userId,
      from,
      to,
    });

    await history.save();

    return new Response(
      JSON.stringify({ success: true, id: history._id }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to save route" }),
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await connect();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Missing userId" }),
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return new Response(
      JSON.stringify({ error: "Invalid userId" }),
      { status: 400 }
    );
  }

  try {
    const history = await RouteHistory.find({user: userId})
      .populate("user", "name email") 
      .sort({ createdAt: -1 })
      .limit(20);

    return new Response(JSON.stringify(history), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch history" }),
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest) {
  await connect();
 
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(
      JSON.stringify({ error: "Missing userId" }),
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Response(
      JSON.stringify({ error: "Invalid userId" }),
      { status: 400 }
    );
  }
  try {
    const deleted = await RouteHistory.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(
        JSON.stringify({ error: "History not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to delete history" }),
      { status: 500 }
    );
  }
}

