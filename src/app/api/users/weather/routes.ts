import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Latitude and Longitude are required" },
        { status: 400 }
      );
    }

    const key = process.env.WEATHER_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "WEATHER_KEY is missing" },
        { status: 500 }
      );
    }
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${key}`;

    const resp = await fetch(apiUrl);

    if (!resp.ok) {
      const text = await resp.text();
      console.error("OpenWeatherMap error:", text);
      return NextResponse.json(
        { error: "Failed to fetch weather data from OpenWeatherMap" },
        { status: 500 }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Weather API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
