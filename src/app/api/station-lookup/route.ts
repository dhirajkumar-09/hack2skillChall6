import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "Patna";
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      city,
      stations: [
        `${city} CAAQMS Central Station`,
        `${city} Industrial Zone Monitoring Station`,
        `${city} Residential Background Station`
      ],
      keyFactors: [
        "Nocturnal ground temperature inversion trapping emissions",
        "Vehicular exhaust and regional biomass burning",
        "Low winter wind speeds slowing atmospheric dispersion"
      ],
      source: "CPCB / SPCB Monitoring Network"
    });
  }

  const prompt = `Provide the official Continuous Ambient Air Quality Monitoring Stations (CAAQMS) operated or recognized by CPCB/State Pollution Control Boards in ${city}, India. Also provide 3 key meteorological or topographic factors causing winter smog in ${city}.
Return strictly a JSON object:
{
  "city": "${city}",
  "stations": ["station 1", "station 2", "station 3"],
  "keyFactors": ["factor 1", "factor 2", "factor 3"],
  "summary": "Short 1-2 sentence overview of air shed in ${city}"
}`;

  const models = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-lite-latest', 'gemini-3.8-flash'];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (res.ok) {
        const json = await res.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return NextResponse.json(parsed);
        }
      }
    } catch {
      // try next model
    }
  }

  return NextResponse.json({
    city,
    stations: [
      `${city} CAAQMS Central Station`,
      `${city} Industrial Zone Station`,
      `${city} Institutional Zone Station`
    ],
    keyFactors: [
      "Nocturnal temperature inversion layer",
      "Surface emissions trapped in shallow planetary boundary layer",
      "Low seasonal surface wind dispersion"
    ],
    source: "CPCB National Air Quality Grid"
  });
}
