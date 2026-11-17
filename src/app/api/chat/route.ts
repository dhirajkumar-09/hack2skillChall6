import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/llm-provider";
import { DEFAULT_USER_PROFILE } from "@/lib/personas";
import { FALLBACK_AQI_DATA } from "@/lib/aqi-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = body.query || "";
    const history = body.history || [];
    const profile = body.profile || DEFAULT_USER_PROFILE;
    const aqiData = body.aqiData || FALLBACK_AQI_DATA;
    const language = body.language || profile.language || "en";

    if (!query.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const response = await generateChatResponse(query, history, profile, aqiData, language);
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to generate chat response", details: err?.message },
      { status: 500 }
    );
  }
}
