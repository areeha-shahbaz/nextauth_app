import { NextResponse } from "next/server";

export async function GET(request:Request){
    try{
        const url = new URL(request.url);
        const lat = url.searchParams.get("lat");
        const lon = url.searchParams.get("lon");

        if(!lat ||!lon){
            return NextResponse.json({error:"Latitude and Longitude are required"},{status:400})
        }
       const key = process.env.WEATHER_KEY;
        if(!key){
            return NextResponse.json({error:"API key is missing"},{status:500}) 
    }
    const resp =await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${key}`);
    if(!resp.ok){
        return NextResponse.json({error:"Failed to fetch weather data"},{status:500})
    }
    const data= await resp.json();
    return NextResponse.json(data);
    } catch(error){
        console.error("Weather fetch error:",error);
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}