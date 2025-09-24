import { NextRequest, NextResponse } from "next/server";
import connect from "src/dbConnection/dbConnection";
import Order from "src/models/orderModel";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    await connect();

    const order = await Order.findById(orderId);
    console.log(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    order.status = "paid";
    await order.save();

    return NextResponse.json({ message: "Order marked as paid" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
