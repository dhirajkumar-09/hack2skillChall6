import { NextRequest, NextResponse } from "next/server";
import { generateDailyPlan } from "@/lib/llm-provider";
import { fetchLiveAQI } from "@/lib/aqi-service";
import { DEFAULT_USER_PROFILE } from "@/lib/personas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profile = body.profile || DEFAULT_USER_PROFILE;
    const aqiData = body.aqiData || await fetchLiveAQI(profile.latitude, profile.longitude);
    const language = body.language || profile.language || "en";
    const apiKey = body.apiKey;

    const plan = await generateDailyPlan(profile, aqiData, language, apiKey);
    return NextResponse.json(plan);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to generate daily plan", details: err?.message },
      { status: 500 }
    );
  }
}
