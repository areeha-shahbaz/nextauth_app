import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const lat = searchParams.get("lat");
//   const lon = searchParams.get("lon");

//   if (!lat || !lon) {
//     return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
//   }

//   const apiKey = process.env.WEATHER_API_KEY;
//   const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

//   const res = await fetch(url);
//   const data = await res.json();

//   return NextResponse.json(data);
// }
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
  }

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key missing" }, { status: 500 });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

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
