"use client";
import { useState } from "react";

export default function ImageAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  

      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const url = `${baseURL}/api/analyze`; 
            console.log("Sending request to:", url);

        const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate caption");
      } else {
        setCaption(data.caption);
      }


      if (!res.ok) {
        setError(data.error || "Failed to generate caption");
      } else {
        setCaption(data.caption);
      }
    } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Something went wrong");
  }
}
 finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h1 className="heeading_Img">AI Image Analyzer</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="upload"
      />

      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{ width: "300px", height: "auto", borderRadius: "10px" }}
        />
      )}

      <button
        onClick={handleAnalyze}
        disabled={!file || loading}
        className="analyze-button"
      >
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
  );
}
