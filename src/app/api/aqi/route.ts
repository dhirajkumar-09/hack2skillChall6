import { NextRequest, NextResponse } from "next/server";
import { fetchLiveAQI } from "@/lib/aqi-service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "28.6139"); // Default Delhi
  const lon = parseFloat(searchParams.get("lon") || "77.2090");

  try {
    const aqiData = await fetchLiveAQI(lat, lon);
    return NextResponse.json(aqiData);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch air quality data", details: err?.message },
      { status: 500 }
    );
  }
}
