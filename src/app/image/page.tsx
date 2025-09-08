"use client";
import dynamic from "next/dynamic";

const ImageAnalyzer = dynamic(() => import("src/app/components/image-analyzer"), {
  ssr: false, 
});

export default function ImagePage() {
  return <ImageAnalyzer/>;
}