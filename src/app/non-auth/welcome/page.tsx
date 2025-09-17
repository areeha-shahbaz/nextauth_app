// "use client";
// import { useRouter } from "next/navigation";
// import Header from "../../components/header";
// export default function WelcomePage() {
//   const router = useRouter();

//   return (
   
//     <div className="page-container">
//       <Header/>
//       <main className="page-main">
//         <div className="overlay">
//         <h2> Welcome!</h2>
//         <p>You have successfully logged in. Click below to go to home page.</p>
//         <button onClick={() => router.push("/auth/home")}>Go to Home</button>
//         </div>
//       </main>
//     </div>

//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/header";
import PageStyles from "./page.module.css";
import { useRequireAuth } from "../../../authCondition";
import Image from "next/image";
<Image src="/map img.jpg" alt="Weather preview" width={400} height={300} />

export default function WelcomePage() {
    useRequireAuth();
  const router = useRouter();
  const [temps, setTemps] =useState<{[key:string ]:number | string}>({});
  const cities = ["New York", "London", "Paris", "Tokyo", "Sydney", "Dubai"];

  useEffect(() => {
    async function fetchWeather(){
     const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      const newTemps: { [key: string]: number | string } = {};
      for (const city of cities) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    const data = await res.json();

    if (res.ok && data.main) {
      newTemps[city] = Math.round(data.main.temp);
    } else {
      console.error("Weather fetch failed for", city, data);
      newTemps[city] = "Error"; 
    }
  } catch (err) {
    console.error("error fetching the weather:", city, err);
    newTemps[city] = "Error"; 
  }
}

      setTemps(newTemps);
    }
  fetchWeather();
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, [cities]);

return (
   <div className="page-container">
     <Header/>    
      <main className="page-main">
        <div className={PageStyles.weatherLayout}>
          <div className={PageStyles.leftPanel}>
            <div className={PageStyles.weatherPreview}>
              <h3>Weather Map</h3>
                <div className={PageStyles.previewImage}>
                <Image 
                  src="/map img.jpg" 
                  alt="Weather preview" 
                  width={400} 
                  height={300} 
                  className={PageStyles.previewImage}
                />

                </div>
                <button 
                  className={PageStyles.linkButton} 
                  onClick={() => router.push("/weather")}>Open Map →</button>
      </div>
    </div>
          <div className={PageStyles.rightPanel}>
            <h3>City Temperatures</h3>
            <div className={PageStyles.cityList}>
              {cities.map((city) => (
                <div key={city} className={PageStyles.cityItem}>
                  {city}: {temps[city] !== undefined ? `${temps[city]}°C` : "Loading..."}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
