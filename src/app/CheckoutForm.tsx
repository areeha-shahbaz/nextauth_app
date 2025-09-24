"use client";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

interface CheckoutFormProps {
  onPaymentSuccess: () => void; 
}

export default function CheckoutForm({ onPaymentSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!email) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/stripe/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
          await fetch("/api/users/mark-paid", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
     
        onPaymentSuccess(); 
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        autoComplete="off"
        className="p-3 border rounded mb-4 w-full"
      />
      <CardElement className="p-3 border rounded mb-4" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-blue-500 text-white px-6 py-2 rounded w-full"
      >
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
}