"use client";

import CheckoutForm from "./CheckoutForm";

interface CheckoutWrapperProps {
  onPaymentSuccess: () => void;
}

export default function CheckoutWrapper({ onPaymentSuccess }: CheckoutWrapperProps) {
  return (
    <div className="w-full max-w-md p-6 border rounded shadow flex flex-col gap-4">
      <CheckoutForm onPaymentSuccess={onPaymentSuccess} />
    </div>
  );
}
