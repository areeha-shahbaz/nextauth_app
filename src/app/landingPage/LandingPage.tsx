// "use client";

// import { useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   useMapEvents,
//   useMap,
// } from "react-leaflet";
// import L from "leaflet";
// import { LeafletMouseEvent } from "leaflet";
// import "leaflet/dist/leaflet.css";
// import styles from "./landing.module.css";


// interface WeatherCurrent {
//   temp: number;
//   weather?: { description: string }[];
// }

// interface WeatherDaily {
//   dt: number;
//   temp: { day: number };
//   weather?: { description: string }[];
// }

// interface WeatherData {
//   timezone: string;
//   current?: WeatherCurrent;
//   daily?: WeatherDaily[];
// }
// export default function LandingPage() {
//   const DEFAULT_LOCATION: [number, number] = [30.3753, 69.3451]; 

//   const [marker, setMarker] = useState<[number, number] | null>(null);
//   const [weather, setWeather] = useState<WeatherData | null>(null);
//   const [city, setCity] = useState("");

//   const MapClickHandler = ({
//     setMarker,
//     fetchWeather,
//   }: {
//     setMarker: (coords: [number, number]) => void;
//     fetchWeather: (lat: number, lng: number) => void;
//   }) => {
//     useMapEvents({
//       click(e: LeafletMouseEvent) {
//         const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
//         setMarker(coords);
//         fetchWeather(coords[0], coords[1]);
//       },
//     });
//     return null;
//   };
//   const SetMapView = ({ coords }: { coords: [number, number] }) => {
//     const map = useMap();
//     map.setView(coords, 5);
//     return null;
//   };

//   const fetchWeather = async (lat: number, lng: number) => {
//     try {
//       const res = await fetch(`/api/weather?lat=${lat}&lon=${lng}`);
//       const data = await res.json();
//       setWeather(data);
//     } catch (err) {
//       console.error("Weather fetch error:", err);
//     }
//   };

//   const handleCitySearch = async () => {
//     if (!city) return;
//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/search?format=json&q=${city}`
//     );
//     const data = await res.json();
//     if (data && data.length > 0) {
//       const coords: [number, number] = [
//         parseFloat(data[0].lat),
//         parseFloat(data[0].lon),
//       ];
//       setMarker(coords);
//       fetchWeather(coords[0], coords[1]);
//     }
//   };

//   return (
//     <div className={styles.pageContainer}>
//       <div className={styles.searchBar}>
//         <input
//           type="text"
//           placeholder="Search for a city..."
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//         />
//         <button onClick={handleCitySearch}>Search</button>
//       </div>

//       <MapContainer
//         center={marker ?? DEFAULT_LOCATION}
//         zoom={5}
//         scrollWheelZoom={true}
//         style={{ width: "100%", height: "100vh" }}
//       >
//         <TileLayer
//           {...{
//             url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//             attribution:
//               '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//           }}
//         />
//         {marker && <Marker position={marker} />}
//         {marker && <SetMapView coords={marker} />}
//         <MapClickHandler setMarker={setMarker} fetchWeather={fetchWeather} />
//       </MapContainer>

//       {weather && (
//         <div className={styles.weatherOverlay}>
//           <h2>Weather — {weather.timezone}</h2>
//           {weather.current && (
//             <p>
//               Now: {weather.current.temp}°C —{" "}
//               {weather.current.weather?.[0]?.description}
//             </p>
//           )}
//           {weather.daily && (
//             <ul>
//               {weather.daily.slice(0, 5).map((day: WeatherDaily) => (
//                 <li key={day.dt}>
//                   {new Date(day.dt * 1000).toLocaleDateString()} —{" "}
//                   {day.temp.day}°C — {day.weather?.[0]?.description}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./landing.module.css";

interface WeatherCurrent {
  temp: number;
  weather?: { description: string }[];
}

interface WeatherDaily {
  dt: number;
  temp: { day: number };
  weather?: { description: string }[];
}

interface WeatherData {
  timezone: string;
  current?: WeatherCurrent;
  daily?: WeatherDaily[];
}

export default function LandingPage() {
  const DEFAULT_LOCATION: [number, number] = [30.3753, 69.3451]; // Pakistan center

  const [marker, setMarker] = useState<[number, number] | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [city, setCity] = useState("");

  // Handle click on map
  const MapClickHandler = ({
    setMarker,
    fetchWeather,
  }: {
    setMarker: (coords: [number, number]) => void;
    fetchWeather: (lat: number, lng: number) => void;
  }) => {
    useMapEvents({
      click(e: LeafletMouseEvent) {
        const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
        setMarker(coords);
        fetchWeather(coords[0], coords[1]);
      },
    });
    return null;
  };

  // Set map view when marker changes
  const SetMapView = ({ coords }: { coords: [number, number] }) => {
    const map = useMap();
    map.setView(coords, 6);
    return null;
  };

  // Fetch weather from backend
  const fetchWeather = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lng}`);
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error("Weather fetch error:", err);
    }
  };

  // Search by city using OpenStreetMap
  const handleCitySearch = async () => {
    if (!city) return;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${city}`
    );
    const data = await res.json();
    if (data && data.length > 0) {
      const coords: [number, number] = [
        parseFloat(data[0].lat),
        parseFloat(data[0].lon),
      ];
      setMarker(coords);
      fetchWeather(coords[0], coords[1]);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Search Bar */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleCitySearch}>Search</button>
      </div>

      {/* Map */}
      <MapContainer
        center={marker ?? DEFAULT_LOCATION}
        zoom={5}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100vh" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {marker && <Marker position={marker} />}
        {marker && <SetMapView coords={marker} />}
        <MapClickHandler setMarker={setMarker} fetchWeather={fetchWeather} />
      </MapContainer>

      {/* Weather Overlay */}
      {weather && (
        <div className={styles.weatherOverlay}>
          <h2>Weather — {weather.timezone}</h2>
          {weather.current && (
            <p>
              Now: {weather.current.temp}°C —{" "}
              {weather.current.weather?.[0]?.description}
            </p>
          )}
          {weather.daily && (
            <ul>
              {weather.daily.slice(0, 5).map((day) => (
                <li key={day.dt}>
                  {new Date(day.dt * 1000).toLocaleDateString()} —{" "}
                  {day.temp.day}°C — {day.weather?.[0]?.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
