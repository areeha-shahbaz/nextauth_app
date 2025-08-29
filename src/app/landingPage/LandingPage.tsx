'use client';
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import L from 'leaflet';

type WeatherData = {
  temp: number;
  description: string;
};

const LandingPage = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`/api/users/weather?lat=${lat}&lon=${lon}`);
      if (!res.ok) throw new Error('Weather API not found');
      const data = await res.json();
      setWeather({
        temp: data.main.temp,
        description: data.weather[0].description,
      });
      setMarkerPos([lat, lon]);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setWeather(null);
    }
  };

  const MapClickHandler = () => {
    useMapEvent('click', (e) => {
      fetchWeather(e.latlng.lat, e.latlng.lng);
    });
    return null;
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={[31.5, 73]} zoom={7} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler />

        {markerPos && weather && (
          <Marker position={markerPos}>
            <Popup>
              <div>
                <h3>Weather Forecast</h3>
                <p>Temperature: {weather.temp}°C</p>
                <p>Description: {weather.description}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default LandingPage;
