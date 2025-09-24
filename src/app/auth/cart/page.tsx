"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
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

function CheckoutForm({
  cartItems,
  clearCart,
}: {
  cartItems: CartItem[];
  clearCart: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(totalPrice * 100) }),
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const removeItem = (id: number) =>
    setCartItems(cartItems.filter((item) => item.id !== id));

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart"); 
  };

  if (cartItems.length === 0) {
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
        {cartItems.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <img
              src={item.image}
              alt={item.title}
              className={styles.cartImage}
            />
            <div className={styles.cartInfo}>
              <h3>{item.title}</h3>
              <p>${item.price}</p>
              <div className={styles.quantityControl}>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  +
                </button>
              </div>
            </div>
            <button
              className={styles.removeBtn}
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <Elements stripe={stripePromise}>
        <CheckoutForm cartItems={cartItems} clearCart={clearCart} />
      </Elements>
    </div>
    </div>
  );
}
