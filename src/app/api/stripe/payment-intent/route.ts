import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import connect from "src/dbConnection/dbConnection";
import User from "src/models/userModel";

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);


export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.email) {
      console.log("Email is missing from request body");
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { email } = body;
    await connect();
    const user = await User.findOne({ email });
    if (user) {
      user.hasPaid = true;
      await user.save();
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500, 
      currency: "usd",
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error("PaymentIntent error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

