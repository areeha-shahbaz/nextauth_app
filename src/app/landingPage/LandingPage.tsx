"use client";

import React, { useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import styles from "./landing.module.css";

type LatLng = { lat: number; lng: number };

interface Weather {
  timezone: string;
  current?: {
    temp: number;
    weather?: { description: string }[];
  };
  daily?: {
    dt: number;
    temp: { day: number };
    weather?: { description: string }[];
  }[];
}

const DEFAULT_CENTER: LatLng = { lat: 20.5937, lng: 78.9629 };
const MAP_CONTAINER_STYLE = { width: "100%", height: "500px" }; 
export default function LandingPage() {
  const [marker, setMarker] = useState<LatLng | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error("Error fetching weather:", err);
    }
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    const location = place?.geometry?.location;
    if (!location) return;

    const lat = location.lat();
    const lng = location.lng();
    setMarker({ lat, lng });
    fetchWeather(lat, lng);
  };

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    const location = e.latLng;
    if (!location) return;

    const lat = location.lat();
    const lng = location.lng();
    setMarker({ lat, lng });
    fetchWeather(lat, lng);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Weather Forecast Map</h1>

      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string}
        libraries={["places"]}
      >
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type="text"
            placeholder="Search city..."
            className={styles.searchInput}
          />
        </Autocomplete>

        <div className={styles.mapContainer}>
          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={marker ?? DEFAULT_CENTER}
            zoom={marker ? 8 : 3}
            onClick={onMapClick}
          >
            {marker && <Marker position={marker} />}
          </GoogleMap>
        </div>
      </LoadScript>

      {weather && (
        <div className={styles.weatherContainer}>
          <h2 className={styles.weatherHeading}>Weather — {weather.timezone}</h2>
          {weather.current && (
            <p className={styles.weatherNow}>
              Now: {weather.current.temp}°C — {weather.current.weather?.[0]?.description}
            </p>
          )}
          {weather.daily && (
            <ul className={styles.weatherList}>
              {weather.daily.slice(0, 5).map((d) => (
                <li key={d.dt}>
                  {new Date(d.dt * 1000).toLocaleDateString()} — {d.temp.day}°C —{" "}
                  {d.weather?.[0]?.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
