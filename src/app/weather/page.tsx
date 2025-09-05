"use client";
import WeatherMap from "src/app/components/WeatherMap";

export default function WeatherPage() {

  return <WeatherMap />;
}
// import dynamic from "next/dynamic";

// const WeatherMap = dynamic(() => import("src/app/components/WeatherMap"), {
//   ssr: false,
// });

// export default function WeatherPage() {
//   return <WeatherMap />;
// }
