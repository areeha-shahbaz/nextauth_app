"use client";

import React, { useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import styles from "./landing.module.css";

type Coordinates = { lat: number; lng: number };

interface WeatherData {
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

const DEFAULT_LOCATION: Coordinates = { lat: 30.3753, lng: 69.3451 };
const MAP_SIZE = { width: "100%", height: "500px" };

export default function LandingPage() {
  const [markerPosition, setMarkerPosition] = useState<Coordinates | null>(null);
  
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const fetchWeatherData = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lng}`);
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
    }
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current?.getPlace();
    const location = place?.geometry?.location;
    if (!location) return;

    const lat = location.lat();
    const lng = location.lng();
    setMarkerPosition({ lat, lng });
    fetchWeatherData(lat, lng);
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const location = event.latLng;
    if (!location) return;

    const lat = location.lat();
    const lng = location.lng();
    setMarkerPosition({ lat, lng });
    fetchWeatherData(lat, lng);
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
          onPlaceChanged={handlePlaceSelect}
        >
          <input
            type="text"
            placeholder="Search for a city..."
            className={styles.searchInput}
          />
        </Autocomplete>

        <div className={styles.mapContainer}>
          <GoogleMap
            mapContainerStyle={MAP_SIZE}
            center={markerPosition ?? DEFAULT_LOCATION}
            zoom={markerPosition ? 8 : 5}
            onClick={handleMapClick}
          >
            {markerPosition && <Marker position={markerPosition} />}
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
              {weather.daily.slice(0, 5).map((day) => (
                <li key={day.dt}>
                  {new Date(day.dt * 1000).toLocaleDateString()} — {day.temp.day}°C —{" "}
                  {day.weather?.[0]?.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
