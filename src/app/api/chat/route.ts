import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/llm-provider";
import { DEFAULT_USER_PROFILE } from "@/lib/personas";
import { FALLBACK_AQI_DATA } from "@/lib/aqi-service";
import { UserProfile, AQIData, ChatMessage, AppLanguage } from "@/types";

/**
 * Request payload contract for POST /api/chat
 */
interface ChatRequestBody {
  query?: string;
  history?: ChatMessage[];
  profile?: UserProfile;
  aqiData?: AQIData;
  language?: AppLanguage;
  apiKey?: string;
}

/**
 * POST /api/chat
 * Generates grounded, clinically safe GenAI conversational assistance.
 * 
 * @param request NextRequest containing query, conversation history, user profile, and telemetry
 * @returns JSON response with text, citations, and suggested follow-ups
 */
export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const rawQuery = body.query || "";
    
    // Security & Input Validation: String sanitization and length bounds
    const query = typeof rawQuery === "string" ? rawQuery.trim().slice(0, 1000) : "";

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const history: ChatMessage[] = Array.isArray(body.history) ? body.history.slice(-10) : [];
    const profile: UserProfile = body.profile || DEFAULT_USER_PROFILE;
    const aqiData: AQIData = body.aqiData || FALLBACK_AQI_DATA;
    const language: AppLanguage = body.language === "hi" ? "hi" : (profile.language || "en");
    const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : undefined;

    const response = await generateChatResponse(query, history, profile, aqiData, language, apiKey);
    return NextResponse.json(response);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to generate chat response", details: message },
      { status: 500 }
    );
  }
}
