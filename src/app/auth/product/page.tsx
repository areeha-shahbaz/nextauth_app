"use client";

import dynamic from "next/dynamic";
import { useRequireAuth } from "../../../authCondition";

const ProductPage = dynamic(() => import("src/app/components/productTab"), { ssr: false });

export default function Product() {
  useRequireAuth(); 
  return <ProductPage/>;
}
