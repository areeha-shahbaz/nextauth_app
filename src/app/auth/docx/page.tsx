"use client";

import dynamic from "next/dynamic";
import { useRequireAuth } from "../../../authCondition";

const DocxEditor = dynamic(() => import("src/app/components/DocxEditor"), { ssr: false });

export default function DocxPage() {
  useRequireAuth(); 
  return <DocxEditor />;
}
