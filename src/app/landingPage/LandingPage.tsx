"use client";

import React, { useRef, useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import styles from "./landing.module.css";

type Coordinates = { lat: number; lng: number };

interface WeatherData {
  timezone: string;
  current?: { temp: number; weather?: { description: string; icon: string }[] };
  daily?: { dt: number; temp: { day: number }; weather?: { description: string; icon: string }[] }[];
}

const DEFAULT_LOCATION: Coordinates = { lat: 30.3753, lng: 69.3451 }; 
const MAP_SIZE = { width: "100%", height: "100vh" }; 

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

  useEffect(() => {
    fetchWeatherData(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng);
  }, []);

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
    <div className={styles.pageContainer}>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string}
        libraries={["places"]}
      >
        <GoogleMap
          mapContainerStyle={MAP_SIZE}
          center={markerPosition ?? DEFAULT_LOCATION}
          zoom={markerPosition ? 8 : 5}
          onClick={handleMapClick}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>

        <div className={styles.searchWrapper}>
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
        </div>

        {weather && (
          <div className={styles.weatherOverlay}>
            <h2>Weather — {weather.timezone}</h2>

            {weather.current && (
              <div className={styles.currentWeather}>
                <img
                  src={`http://openweathermap.org/img/wn/${weather.current.weather?.[0]?.icon}@2x.png`}
                  alt="icon"
                />
                <div>
                  <p className={styles.currentTemp}>{weather.current.temp}°C</p>
                  <p>{weather.current.weather?.[0]?.description}</p>
                </div>
              </div>
            )}

            {weather.daily && (
              <div className={styles.dailyWeather}>
                {weather.daily.slice(0, 5).map((day) => (
                  <div key={day.dt} className={styles.weatherCard}>
                    <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
                    <img
                      src={`http://openweathermap.org/img/wn/${day.weather?.[0]?.icon}@2x.png`}
                      alt="icon"
                    />
                    <p>{day.temp.day}°C</p>
                    <p>{day.weather?.[0]?.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </LoadScript>
    </div>
  );
}
