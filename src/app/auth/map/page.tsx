"use client";
import dynamic from "next/dynamic";
import { useRequireAuth } from "../../../authCondition";
const Map = dynamic(() => import("src/app/components/Map"), {
  ssr: false, 
});

export default function MapPage() {
  useRequireAuth();
  return <Map/>;
}