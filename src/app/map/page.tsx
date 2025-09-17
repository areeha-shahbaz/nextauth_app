"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("src/app/components/Map"), {
  ssr: false, 
});

export default function MapPage() {
  return <Map/>;
}