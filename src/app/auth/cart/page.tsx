"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import {useCart} from "src/app/context/CartContext";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Link from "next/link";
import styles from "./cart.module.css";

type CartItem = {
  id: number;
  image: string;
  title: string;
  price: number;
  quantity: number;
  
};

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_PUBLISHABLE_KEY!);

function CheckoutForm(){
const {cart, clearCart}= useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
 const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const parsedUser = JSON.parse(storedUser);
    setUserId(parsedUser._id || parsedUser.id);
  }, []); 

  const router = useRouter();
    const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

  if (!userId) {
  return new Response(
    
    JSON.stringify({ error: "User ID missing" }),
    { status: 400, headers: { "Content-Type": "application/json" } }
  );
}

    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(totalPrice * 100) ,
          cartItem:cart,
          userId,
        }),
      });

      const data = await res.json();
      const clientSecret = data.clientSecret;

      const card = elements.getElement(CardElement)!;
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });
      if (paymentResult.error) {
        alert(paymentResult.error.message);
      } else if (paymentResult.paymentIntent?.status === "succeeded") {
        clearCart(); 
        router.push("/success");
      }
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.checkoutForm}>
      <CardElement className={styles.cardElement} />
      <button type="submit" className={styles.checkoutBtn} disabled={loading}>
        {loading ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
      </button>
    </form>
  );
}
export default function CartPage() {
  const { cart, removeFromCart, clearCart, loading } = useCart(); 
  if (loading) {
    return (
        <h2>Loading your cart...</h2>
    );
  }
  if (cart.length === 0) {
    return (
      <div className={styles.pg}>
        <div className={styles.emptyCart}>
          <h2>Your cart is empty</h2>
          <Link href="/auth/fakeStore">Go back to store</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pg}>
      <div className={styles.cartPage}>
        <h1>Your Cart</h1>
        <div className={styles.cartContainer}>
          {cart.map((item) => (
            <div key={item.id} className={styles.cartItem}>
            <img src={item.image} alt={item.title} className={styles.cartImage}/>
              <div className={styles.cartInfo}>
                <h3>{item.title}</h3>
                <p>${item.price}</p>
                <div className={styles.quantityControl}>
                  <button
                    onClick={() =>
                      removeFromCart(item.id) 
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}
