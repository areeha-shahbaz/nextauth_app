"use client";
import dynamic from "next/dynamic";

import { useRequireAuth } from "../../../authCondition";
const ImageAnalyzer = dynamic(() => import("src/app/components/image-analyzer"), {
  ssr: false, 
});

export default function ImagePage() {
  useRequireAuth();
  return <ImageAnalyzer/>;
}