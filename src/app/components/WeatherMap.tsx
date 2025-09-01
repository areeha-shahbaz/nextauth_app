"use client";
import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import styles from "./WeatherMap.module.css";
import Header from "./header";  
interface Weather {
  name: string;
  country: string;
  temp: number;
  description: string;
  feels_like: number;
  humidity: number;
  wind: number;
  icon: string;
}

function FlyToLocation({ coords }: { coords: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 5);
    }
  }, [coords, map]);

  return null;
}


function LocationMarker({ setWeather, setShowCard }: { 
  setWeather: (w: Weather) => void, 
  setShowCard: (v: boolean) => void 
}) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lon=${lng}`);
        const data = await res.json();

        if (data && data.main) {
          setWeather({
            name: data.name,
            country: data.sys.country,
            temp: data.main.temp,
            description: data.weather[0].description,
            feels_like: data.main.feels_like,
            humidity: data.main.humidity,
            wind: data.wind.speed,
            icon: data.weather[0].icon,
          });
          setShowCard(true);
        }
      } catch (err) {
        console.error("Weather API failed:", err);
      }
    },
  });
  return null;
}

export default function WeatherMap() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [city, setCity] = useState("");

  const handleSearch = async () => {
    if (!city) return;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      );
      const data = await res.json();
      if (data && data.main) {
        setWeather({
          name: data.name,
          country: data.sys.country,
          temp: data.main.temp,
          description: data.weather[0].description,
          feels_like: data.main.feels_like,
          humidity: data.main.humidity,
          wind: data.wind.speed,
          icon: data.weather[0].icon,
        });
        setCoords([data.coord.lat, data.coord.lon]);
        setShowCard(true);
      }
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div className={styles.container}>
      <Header />  

      <div className={styles.searchBar}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search city..."
          className={styles.input}
        />
        <button onClick={handleSearch} className={styles.button}>Search</button>
      </div>

      <MapContainer center={[30.3753, 69.3451]} zoom={5} className={styles.map}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationMarker setWeather={setWeather} setShowCard={setShowCard} />
        <FlyToLocation coords={coords} />
      </MapContainer>

      {showCard && weather && (
        <div className={styles.card}>
          <h3>
            {weather.name}, {weather.country}
          </h3>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
          />
          <p><strong>{Math.round(weather.temp)}°C</strong> ({weather.description})</p>
          <p>Feels like: {Math.round(weather.feels_like)}°C</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind: {weather.wind} m/s</p>
        </div>
      )}
    </div>
  );
}
