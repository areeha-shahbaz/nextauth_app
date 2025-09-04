"use client";
import { useState } from "react";
import WeatherMap from "src/app/components/WeatherMap";

export default function WeatherPage() {
  const [coords, setCoords] = useState<[number, number] | null>(null);

  return <WeatherMap />;
}
