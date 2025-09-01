"use client";
import dynamic from "next/dynamic";

const LandingPage = dynamic(() => import("./landingPage/LandingPage"), { ssr: false });

export default function Page() {
  return <LandingPage />;
}


