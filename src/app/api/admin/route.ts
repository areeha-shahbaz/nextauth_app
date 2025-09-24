import {NextResponse, NextRequest} from "next/server";
import connect from "src/dbConnection/dbConnection";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "src/models/userModel";
import Order from "src/models/orderModel";
import { sendEmail } from "src/helpers/mailer";
export const runtime = "nodejs";

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  status: string;
  
}


async function authorizeAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  console.log("Auth header:", authHeader);
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (!token) throw new Error("unauthorized");
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch (err) {
    console.log("JWT error:", err);
    throw new Error("Invalid token");
  }
  console.log("Decoded token:", decoded);
  if (decoded.role !== "admin") throw new Error("Not allowed");
  if (decoded.status !== "active") throw new Error("Deactivated");
  return decoded;
}

export async function GET(req:NextRequest){
    try{
        await connect();
        await authorizeAdmin(req);
        const users = await User.find();
        return NextResponse.json({success: true,users});
    }
    catch (err: unknown) {
  let message = "Something went wrong";
  if (err instanceof Error) {
    message = err.message;
  }
  return NextResponse.json({ success: false, error: message }, { status: 403 });
}
    }
 
 export async function POST(req: NextRequest) {
  try {
    await connect();
    await authorizeAdmin(req);

    const { name, email, role, status } = await req.json();
    if (!name || !email || !role || !status) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      );
    }
 const tempPassword = crypto.randomBytes(6).toString("base64");
 const bcryptjs = (await import ("bcryptjs")).default;
 const passwordHash= await bcryptjs.hash(tempPassword,10);
    
const newUser = await User.create({
  uuid: crypto.randomUUID(),
  name,
  email,
  role,
  status,
  passwordHash,
  mustChangePassword:true,
});
 await sendEmail({
  email,
  emailType:"ADMIN_CREATE",
  userId: newUser._id.toString(),
  tempPassword,
 });

    return NextResponse.json({
      success: true,
      message: "User created & temporary password sent via email",
    });
  }catch (err: unknown) {
  let message = "Something went wrong";
  if (err instanceof Error) {
    message = err.message;
  }
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}
}



export async function PUT(req: NextRequest) {
  try {
    await connect();
    await authorizeAdmin(req);

    const { id, name, email, role, status, password } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      );
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    let updated = false;

    if (name && name !== user.name) {
      user.name = name;
      updated = true;
    }
    if (email && email !== user.email) {
      user.email = email;
      updated = true;
    }
    if (role && role !== user.role) {
      user.role = role;
      updated = true;
    }
    if (status && status !== user.status) {
      user.status = status;
      updated = true;
    }

    if (password && password.trim() !== "") {
      const bcryptjs = (await import("bcryptjs")).default;
      user.passwordHash = await bcryptjs.hash(password, 10);
      updated = true;
    }

    if (!updated) {
      return NextResponse.json({
        success: false,
        message: "No changes detected",
      });
    }

    await user.save({ validateModifiedOnly: true });

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (err: unknown) {
  let message = "Something went wrong";
  if (err instanceof Error) {
    message = err.message;
  }
  return NextResponse.json(
    { success: false, error: message },
    { status: 403 }
  );
}

}
export async function PATCH(req: NextRequest) {
  try {
    await connect();
    await authorizeAdmin(req);

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: "User ID and status required" }, { status: 400 });
    }

    if (!["active", "deactive"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status value" }, { status: 400 });
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    user.status = status;
    await user.save({ validateModifiedOnly: true });

    return NextResponse.json({
      success: true,
      message: `User ${status === "active" ? "activated" : "deactivated"} successfully`,
    });

  }catch (err: unknown) {
  let message = "Something went wrong in status";
  if (err instanceof Error) {
    message = err.message;
  }
  return NextResponse.json({ success: false, error: message }, { status: 403 });
}
}

    
export async function DELETE(req: NextRequest) {

  try {
    await connect();
    await authorizeAdmin(req);

    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 });

    const user = await User.findById(id);
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    await user.deleteOne();
    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (err: unknown) {
  if (err instanceof Error) {
    return NextResponse.json({ success: false, error: err.message }, { status: 403 });
  }
  return NextResponse.json({ success: false, error: "Unknown error" }, { status: 403 });
}

}

