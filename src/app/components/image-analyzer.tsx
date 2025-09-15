"use client";

import { useState, useEffect } from "react";
import Header from "./header";
import CheckoutForm from "src/app/CheckoutForm";
import CheckoutWrapper from "src/app/CheckoutWrapper";

export default function ImageAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState<boolean | null>(null);
useEffect(() => {
  const checkUserPayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setHasPaid(false);
        return;
      }

      const res = await fetch("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text(); 
        console.error("Profile API error:", text);
        setHasPaid(false);
        return;
      }

      const data = await res.json();
      setHasPaid(data?.user?.hasPaid || false);

    } catch (err) {
      console.error("Payment check failed:", err);
      setHasPaid(false);
    }
  };

  checkUserPayment();
}, []);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setCaption(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setCaption(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Analyze API error:", text);
        setError("Failed to generate caption");
        return;
      }

      const data = await res.json();
      setCaption(data.caption);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (hasPaid === null) {
    return <p>Checking payment status...</p>;
  }

if (!hasPaid) {
  return (
    <div >
      <Header />
      <h2 >Unlock Image Analyzer</h2>
      <p >You need to pay before using the analyzer.</p>
      <CheckoutWrapper onPaymentSuccess={() => setHasPaid(true)}/>
    </div>
  );}

  return (
    <div className="cont.">
      <Header />
      <main className="container">
        <h1 className="heeading_Img">AI Image Analyzer</h1>

        <input type="file" accept="image/*" onChange={handleFileChange} className="upload" />

        {preview && (
          <img
            src={preview}
            alt="preview"
            style={{ width: "300px", height: "auto", borderRadius: "10px" }}
          />
        )}

        <button onClick={handleAnalyze} disabled={!file || loading} className="analyze-button">
          {loading ? "Analyzing..." : "Analyze Image"}
        </button>

        {error && <p className="errorCss">{error}</p>}

        {caption && (
          <div className="mt-4">
            <h2 className="description">Description</h2>
            <p className="caption">{caption}</p>
          </div>
        )}
      </main>
    </div>
  );
}
