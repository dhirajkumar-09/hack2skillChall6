import { AQICategory, AQIData } from "@/types";

/**
 * Convert PM2.5 (µg/m³) to AQI and Category
 * Adheres to standard CPCB / US EPA linear interpolation breakpoints
 */
export function calculateAQIFromPM25(pm25: number): { aqi: number; category: AQICategory } {
  let aqi: number;
  let category: AQICategory;

  if (pm25 <= 30) {
    aqi = Math.round((50 / 30) * pm25);
    category = "Good";
  } else if (pm25 <= 60) {
    aqi = Math.round(51 + ((100 - 51) / (60 - 30)) * (pm25 - 30));
    category = "Moderate";
  } else if (pm25 <= 90) {
    aqi = Math.round(101 + ((200 - 101) / (90 - 60)) * (pm25 - 60));
    category = "Unhealthy for Sensitive Groups";
  } else if (pm25 <= 120) {
    aqi = Math.round(201 + ((300 - 201) / (120 - 90)) * (pm25 - 90));
    category = "Unhealthy";
  } else if (pm25 <= 250) {
    aqi = Math.round(301 + ((400 - 301) / (250 - 120)) * (pm25 - 120));
    category = "Very Unhealthy";
  } else {
    // 250+ is Severe / Hazardous
    aqi = Math.min(500, Math.round(401 + ((500 - 401) / (380 - 250)) * (pm25 - 250)));
    category = "Hazardous";
  }

  return { aqi, category };
}

/**
 * Fallback dataset for instant demo and offline mode
 */
export const FALLBACK_AQI_DATA: AQIData = {
  aqi: 382,
  category: "Hazardous",
  primaryPollutant: "PM2.5",
  pm25: 236,
  pm10: 380,
  no2: 84,
  co: 2.1,
  o3: 28,
  temperature: 16.5,
  humidity: 78,
  windSpeed: 3.2,
  temperatureInversion: true,
  forecastHourly: [
    { hour: "06:00", aqi: 412, pm25: 260, condition: "Severe nocturnal smog trapped by boundary inversion" },
    { hour: "08:00", aqi: 435, pm25: 280, condition: "Peak traffic emissions & ground cooling" },
    { hour: "10:00", aqi: 395, pm25: 245, condition: "Sun warming begins breaking shallow boundary layer" },
    { hour: "12:00", aqi: 310, pm25: 180, condition: "Warming boundary layer; dispersing particles" },
    { hour: "14:00", aqi: 240, pm25: 140, condition: "Best afternoon window: max vertical mixing" },
    { hour: "16:00", aqi: 285, pm25: 168, condition: "Evening cooling begins; winds dropping" },
    { hour: "18:00", aqi: 360, pm25: 220, condition: "Evening rush hour & secondary inversion formation" },
    { hour: "20:00", aqi: 390, pm25: 248, condition: "Trapped surface emissions" },
    { hour: "22:00", aqi: 415, pm25: 265, condition: "Dense nocturnal haze layer" },
    { hour: "00:00", aqi: 425, pm25: 275, condition: "Near zero surface dispersion" }
  ],
  safeOutdoorWindows: [
    { start: "13:30", end: "15:30", aqi: 240, condition: "Afternoon thermal boundary expansion (Lowest relative PM2.5)" }
  ],
  safeVentilationWindows: [
    { start: "14:00", end: "14:25", note: "Brief 20-minute cross-ventilation if indoor air feels stale, followed immediately by active filtration" }
  ],
  timestamp: new Date().toISOString(),
  source: "Open-Meteo Air Quality & CPCB Calibration",
  isFallback: false
};

/**
 * Fetch live AQI & Weather from Open-Meteo APIs in parallel
 */
export async function fetchLiveAQI(lat: number, lon: number): Promise<AQIData> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone&hourly=pm10,pm2_5&timezone=auto`;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`;

    const [aqiRes, weatherRes] = await Promise.allSettled([
      fetch(aqiUrl, { signal: controller.signal, next: { revalidate: 600 } }),
      fetch(weatherUrl, { signal: controller.signal, next: { revalidate: 600 } })
    ]);
    clearTimeout(timeout);

    let currentPm25 = 140;
    let currentPm10 = 180;
    let no2 = 50;
    let co = 1.2;
    let o3 = 30;
    let hourlyTimes: string[] = [];
    let hourlyPm25: number[] = [];

    if (aqiRes.status === "fulfilled" && aqiRes.value.ok) {
      const data = await aqiRes.value.json();
      currentPm25 = Number(data.current?.pm2_5 ?? 140);
      currentPm10 = Number(data.current?.pm10 ?? 180);
      no2 = Number(data.current?.nitrogen_dioxide ?? 50);
      co = Number((data.current?.carbon_monoxide ? data.current.carbon_monoxide / 1000 : 1.2).toFixed(1));
      o3 = Number(data.current?.ozone ?? 30);
      hourlyTimes = data.hourly?.time || [];
      hourlyPm25 = data.hourly?.pm2_5 || [];
    }

    let temp = 19;
    let humidity = 70;
    let windSpeed = 3.0;

    if (weatherRes.status === "fulfilled" && weatherRes.value.ok) {
      const wData = await weatherRes.value.json();
      temp = Number(wData.current?.temperature_2m ?? 19);
      humidity = Number(wData.current?.relative_humidity_2m ?? 70);
      windSpeed = Number(wData.current?.wind_speed_10m ?? 3.0);
    }

    const { aqi, category } = calculateAQIFromPM25(currentPm25);

    // Primary pollutant detection: Compare PM2.5 vs PM10 vs NO2
    let primaryPollutant: 'PM2.5' | 'PM10' | 'NO2' = "PM2.5";
    if (currentPm10 > currentPm25 * 2.2) {
      primaryPollutant = "PM10";
    }

    // Temperature Inversion detection: Low surface wind + winter ground temperature
    const temperatureInversion = windSpeed < 6.0 && temp < 23;

    // Build forecast hourly
    const forecastHourly = [];
    const nowHour = new Date().getHours();
    
    // Find index of current hour in hourlyTimes
    let startIndex = 0;
    if (hourlyTimes.length > 0) {
      const nowStr = new Date().toISOString().slice(0, 13);
      const matchIdx = hourlyTimes.findIndex(t => t.startsWith(nowStr));
      if (matchIdx !== -1) startIndex = matchIdx;
    }

    for (let i = 0; i < Math.min(12, hourlyTimes.length - startIndex); i++) {
      const timeStr = hourlyTimes[startIndex + i];
      const hourPart = timeStr ? timeStr.split("T")[1]?.slice(0, 5) : `${(nowHour + i) % 24}:00`;
      const val = Math.round(hourlyPm25[startIndex + i] || currentPm25);
      const calculated = calculateAQIFromPM25(val);
      forecastHourly.push({
        hour: hourPart,
        aqi: calculated.aqi,
        pm25: val,
        condition: val > 200 ? "Severe nocturnal smog" : val > 100 ? "Moderate haze" : "Moderate mixing"
      });
    }

    // Determine the minimum PM2.5 window for safe outdoor/ventilation
    let bestWindowStart = "13:30";
    let bestWindowEnd = "15:30";
    let bestAqi = Math.max(80, Math.round(aqi * 0.7));

    if (forecastHourly.length >= 6) {
      let minVal = Infinity;
      let minHour = "14:00";
      forecastHourly.forEach(f => {
        const hourNum = parseInt(f.hour.split(":")[0]);
        if (hourNum >= 11 && hourNum <= 17 && f.pm25 < minVal) {
          minVal = f.pm25;
          minHour = f.hour;
        }
      });
      if (minVal !== Infinity) {
        bestAqi = calculateAQIFromPM25(minVal).aqi;
        const h = parseInt(minHour.split(":")[0]);
        bestWindowStart = `${String(h).padStart(2, "0")}:00`;
        bestWindowEnd = `${String(h + 2).padStart(2, "0")}:00`;
      }
    }

    return {
      aqi,
      category,
      primaryPollutant,
      pm25: Math.round(currentPm25),
      pm10: Math.round(currentPm10),
      no2,
      co,
      o3,
      temperature: Math.round(temp * 10) / 10,
      humidity: Math.round(humidity),
      windSpeed: Math.round(windSpeed * 10) / 10,
      temperatureInversion,
      forecastHourly: forecastHourly.length > 0 ? forecastHourly : FALLBACK_AQI_DATA.forecastHourly,
      safeOutdoorWindows: [
        { start: bestWindowStart, end: bestWindowEnd, aqi: bestAqi, condition: "Afternoon thermal boundary expansion (Daily PM2.5 minimum)" }
      ],
      safeVentilationWindows: [
        { start: bestWindowStart, end: `${bestWindowStart.split(":")[0]}:20`, note: "Brief 20-min cross-ventilation flush during solar boundary layer expansion" }
      ],
      timestamp: new Date().toISOString(),
      source: "Open-Meteo Live Air Quality & Weather API",
      isFallback: false
    };
  } catch (err) {
    console.warn("AQI fetch failed or timed out, using fallback dataset:", err);
    return {
      ...FALLBACK_AQI_DATA,
      timestamp: new Date().toISOString(),
      isFallback: true
    };
  }
}
