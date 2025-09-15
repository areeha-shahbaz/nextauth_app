import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import connect from "src/dbConnection/dbConnection";
import User from "src/models/userModel";
export const runtime = 'nodejs';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// export async function POST(req: NextRequest) {
//   try {
//     const { email } = await req.json();
//     if (!email) {
//       console.log(" email is not fetching");
//       return NextResponse.json({ error: "Email is required" }, { status: 400 });
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: 500, 
//       currency: "usd",
//       receipt_email: email,
//       automatic_payment_methods: { enabled: true },
//     });

//     return NextResponse.json({ clientSecret: paymentIntent.client_secret });
//   } catch (err: any) {
//     console.error("PaymentIntent error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.email) {
      console.log("Email is missing from request body");
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { email } = body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500, 
      currency: "usd",
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error("PaymentIntent error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

