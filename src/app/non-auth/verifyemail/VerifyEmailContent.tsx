"use client";
import { useSearchParams, useRouter } from "next/navigation";
// import {Suspense} from "react";
import { useEffect, useState } from "react";

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
    const router = useRouter();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch("/api/verifyemail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (res.ok) {
          setMessage(" Email verified successfully! You can now log in.");
          setTimeout(() =>{

          router.push("/login");
          }, 2000);
        } else {
          setMessage(` Verification failed: ${data.error}`);
        }
      } catch (err) {
        setMessage("Something went wrong. Please try again later.");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>{message}</h1>
    </div>
  );
}

