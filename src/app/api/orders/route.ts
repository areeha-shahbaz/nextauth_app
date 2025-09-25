import { NextRequest, NextResponse } from "next/server";
import connect from "src/dbConnection/dbConnection";
import Order from "src/models/orderModel";
import User from "src/models/userModel";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  status: string;
}

async function authorizeAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (!token) throw new Error("unauthorized");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    throw new Error("Invalid token");
  }

  if (decoded.role !== "admin") throw new Error("Not allowed");
  if (decoded.status !== "active") throw new Error("Deactivated");
  return decoded;
}

export async function GET(req: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let orders;
    if (userId) {
      orders = await Order.find({ user: userId })
        .populate("user", "name email")
        .sort({ createdAt: -1 });
    } else {
      orders = await Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
 }
 
export async function PATCH(req:NextRequest){
  try{
    await connect();
    await authorizeAdmin(req);
    const {id, status}= await req.json();
    if(!id || !status){
      return NextResponse.json(
        {
          success:false, error:"Order ID and Status are required"
        },{status:400}
      );
    }
    const updated = await Order.findByIdAndUpdate(
    id,{status},{new:true}
    ).populate("user","name email");
    
    console.log("Updated order:", updated);

    if(!updated){
      return NextResponse.json(
        {success:false, error:"order not found"},
        {status:400}
      );
    }
    return NextResponse.json({success:true, order:updated});
  }catch(err:any){
    return NextResponse.json(
      {success:false, error: err.message || "failed to update the order history"},
      {status:500}
    );

  }
}


