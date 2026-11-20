import { NextRequest, NextResponse } from "next/server";
import { fetchLiveAQI } from "@/lib/aqi-service";

/**
 * GET /api/aqi
 * Retrieves live air quality telemetry and forecast for specified coordinates.
 * 
 * @param request NextRequest containing searchParams `lat` and `lon`
 * @returns JSON response with AQIData or error payload
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get("lat") || "28.6139";
  const lonStr = searchParams.get("lon") || "77.2090";

  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);

  // Security & Input Validation: Validate coordinate bounds
  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json(
      { error: "Invalid coordinates", details: "Latitude must be between -90 and 90, longitude between -180 and 180" },
      { status: 400 }
    );
  }

  try {
    const aqiData = await fetchLiveAQI(lat, lon);
    return NextResponse.json(aqiData, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600"
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch air quality data", details: message },
      { status: 500 }
    );
  }
}
