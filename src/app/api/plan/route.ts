import { NextRequest, NextResponse } from "next/server";
import { generateDailyPlan } from "@/lib/llm-provider";
import { fetchLiveAQI } from "@/lib/aqi-service";
import { DEFAULT_USER_PROFILE } from "@/lib/personas";
import { UserProfile, AQIData, AppLanguage } from "@/types";

/**
 * Request payload contract for POST /api/plan
 */
interface PlanRequestBody {
  profile?: UserProfile;
  aqiData?: AQIData;
  language?: AppLanguage;
  apiKey?: string;
}

/**
 * POST /api/plan
 * Synthesizes a structured, highly personalized clean-air plan.
 * 
 * @param request NextRequest containing profile, telemetry, and optional language/apiKey
 * @returns JSON response with DailyCleanAirPlan
 */
export async function POST(request: NextRequest) {
  try {
    const body: PlanRequestBody = await request.json();
    const profile: UserProfile = body.profile || DEFAULT_USER_PROFILE;
    const aqiData: AQIData = body.aqiData || await fetchLiveAQI(profile.latitude, profile.longitude);
    const language: AppLanguage = body.language === "hi" ? "hi" : (profile.language || "en");
    const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : undefined;

    const plan = await generateDailyPlan(profile, aqiData, language, apiKey);
    return NextResponse.json(plan);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to generate daily plan", details: message },
      { status: 500 }
    );
  }
}
