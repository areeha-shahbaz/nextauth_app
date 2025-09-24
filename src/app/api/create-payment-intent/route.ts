import Stripe from "stripe";
import connect from "src/dbConnection/dbConnection";
import orderModel from "src/models/orderModel";
export const runtime = "nodejs";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, 
);

export async function POST(req: Request) {
  try {
    const { amount, cartItems, userId } = await req.json();
    
await connect();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, 
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

await orderModel.create({
  user: userId,
  items:cartItems,
  amount:amount/100,
  paymentIntentId:paymentIntent.id,
  status:"pending",
});
     
 return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("PaymentIntent error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

   
