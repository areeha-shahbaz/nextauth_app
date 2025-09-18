// "use client";
// import WeatherMap from "src/app/components/WeatherMap";

// export default function WeatherPage() {

//   return <WeatherMap />;
// }
"use client";
import dynamic from "next/dynamic";
import { useRequireAuth } from "../../../authCondition";
const WeatherMap = dynamic(() => import("src/app/components/WeatherMap"), {
  ssr: false, 
});

export default function WeatherPage() {
    useRequireAuth();
  return <WeatherMap />;
}

