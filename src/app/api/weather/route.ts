import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const city = searchParams.get("city");

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key missing" }, { status: 500 });
  }

  let url = "";
  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  } else if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  } else {
    return NextResponse.json({ error: "City or coordinates required" }, { status: 400 });
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return NextResponse.json({ error: "Weather fetch failed", details: errData }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Fetch failed", details: err }, { status: 500 });
  }
}




// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   return NextResponse.json({ message: "API working!" });
// }
