"use client";
import dynamic from "next/dynamic";

const WeatherMap = dynamic(() => import("src/app/components/image-analyzer/page"), {
  ssr: false, 
});

export default function ImageAnalyzer() {
  return <ImageAnalyzer/>;
}