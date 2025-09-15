"use client";

import "./global.css";
import { Provider, useDispatch } from "react-redux";
import { store } from "src/store/store";
import { useEffect } from "react";
import { login } from "src/store/authSlice";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
function HydrateAuth({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log("Hydrating Redux with:", parsed); 
        dispatch(login(parsed));
      } catch (err) {
        console.error("Failed to parse stored user", err);
      }
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <HydrateAuth>
            <Elements stripe={stripePromise}>{children}</Elements>
          </HydrateAuth>
        </Provider>
      </body>
    </html>
  );
}
