import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!city && (!lat || !lon)) {
    return NextResponse.json({ error: "Provide city or lat/lon" }, { status: 400 });
  }

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Weather API key missing" }, { status: 500 });
  }

  let url = "";
  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return NextResponse.json({ error: "Weather fetch failed", details: errData }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  }catch (err) {
  console.error("Login failed:", err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
}
