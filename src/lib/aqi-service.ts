import { AQICategory, AQIData, HourlyForecastItem, AQIStandard } from "@/types";
import { logger } from "./logger";

/**
 * Calculate both India CPCB and US EPA / AccuWeather AQI from PM2.5
 */
export function calculateBothAQI(pm25: number): {
  cpcbAqi: number;
  cpcbCategory: AQICategory;
  epaAqi: number;
  epaCategory: AQICategory;
} {
  // 1. CPCB (India National Air Quality Index, INAQI)
  let cpcbAqi: number;
  let cpcbCategory: AQICategory;
  if (pm25 <= 30) {
    cpcbAqi = Math.round((50 / 30) * pm25);
    cpcbCategory = "Good";
  } else if (pm25 <= 60) {
    cpcbAqi = Math.round(51 + ((100 - 51) / (60 - 30)) * (pm25 - 30));
    cpcbCategory = "Moderate";
  } else if (pm25 <= 90) {
    cpcbAqi = Math.round(101 + ((200 - 101) / (90 - 60)) * (pm25 - 60));
    cpcbCategory = "Unhealthy for Sensitive Groups";
  } else if (pm25 <= 120) {
    cpcbAqi = Math.round(201 + ((300 - 201) / (120 - 90)) * (pm25 - 90));
    cpcbCategory = "Unhealthy";
  } else if (pm25 <= 250) {
    cpcbAqi = Math.round(301 + ((400 - 301) / (250 - 120)) * (pm25 - 120));
    cpcbCategory = "Very Unhealthy";
  } else {
    cpcbAqi = Math.min(500, Math.round(401 + ((500 - 401) / (380 - 250)) * (pm25 - 250)));
    cpcbCategory = "Hazardous";
  }

  // 2. US EPA / Global Scale (Used by AccuWeather, HuaFeng, Apple Weather, Google)
  let epaAqi: number;
  let epaCategory: AQICategory;
  if (pm25 <= 12.0) {
    epaAqi = Math.round((50 / 12.0) * pm25);
    epaCategory = "Good";
  } else if (pm25 <= 35.4) {
    epaAqi = Math.round(51 + ((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1));
    epaCategory = "Moderate";
  } else if (pm25 <= 55.4) {
    epaAqi = Math.round(101 + ((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5));
    epaCategory = "Unhealthy for Sensitive Groups";
  } else if (pm25 <= 150.4) {
    epaAqi = Math.round(151 + ((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5));
    epaCategory = "Unhealthy";
  } else if (pm25 <= 250.4) {
    epaAqi = Math.round(201 + ((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5));
    epaCategory = "Very Unhealthy";
  } else if (pm25 <= 350.4) {
    epaAqi = Math.round(301 + ((400 - 301) / (350.4 - 250.5)) * (pm25 - 250.5));
    epaCategory = "Hazardous";
  } else {
    epaAqi = Math.min(500, Math.round(401 + ((500 - 401) / (500.4 - 350.5)) * (pm25 - 350.5)));
    epaCategory = "Hazardous";
  }

  return { cpcbAqi, cpcbCategory, epaAqi, epaCategory };
}

/**
 * Convert PM2.5 (µg/m³) to AQI and Category
 * Defaults to CPCB with optional EPA standard support
 */
export function calculateAQIFromPM25(
  pm25: number, 
  standard: AQIStandard = 'cpcb'
): { aqi: number; category: AQICategory; cpcbAqi: number; epaAqi: number } {
  const { cpcbAqi, cpcbCategory, epaAqi, epaCategory } = calculateBothAQI(pm25);

  if (standard === 'epa') {
    return { aqi: epaAqi, category: epaCategory, cpcbAqi, epaAqi };
  }
  return { aqi: cpcbAqi, category: cpcbCategory, cpcbAqi, epaAqi };
}

/**
 * Fallback dataset for instant demo and offline mode
 */
export const FALLBACK_AQI_DATA: AQIData = {
  aqi: 382,
  cpcbAqi: 382,
  epaAqi: 286,
  category: "Hazardous",
  primaryPollutant: "PM2.5",
  pm25: 236,
  pm10: 380,
  no2: 84,
  co: 2.1,
  o3: 28,
  so2: 13,
  temperature: 17.0,
  humidity: 85,
  windSpeed: 3.2,
  surfacePressure: 1017,
  visibilityKm: 16,
  sunrise: "06:12",
  sunset: "16:58",
  temperatureInversion: true,
  forecastHourly: [
    {
      hour: "06:00",
      aqi: 412,
      cpcbAqi: 412,
      epaAqi: 310,
      category: "Hazardous",
      pm25: 260,
      pm10: 410,
      temperature: 13.5,
      humidity: 86,
      windSpeed: 1.8,
      temperatureInversion: true,
      condition: "Severe nocturnal smog trapped by boundary inversion",
      recommendation: "Ground inversion at peak. Strictly avoid all morning outdoor exercise and keep windows tightly sealed."
    },
    {
      hour: "08:00",
      aqi: 435,
      cpcbAqi: 435,
      epaAqi: 330,
      category: "Hazardous",
      pm25: 280,
      pm10: 440,
      temperature: 15.0,
      humidity: 82,
      windSpeed: 2.5,
      temperatureInversion: true,
      condition: "Peak traffic emissions & ground cooling",
      recommendation: "Rush hour traffic surge. Mandatory sealed headband N95 respirator if commuting."
    },
    {
      hour: "10:00",
      aqi: 395,
      cpcbAqi: 395,
      epaAqi: 295,
      category: "Very Unhealthy",
      pm25: 245,
      pm10: 390,
      temperature: 18.0,
      humidity: 72,
      windSpeed: 3.8,
      temperatureInversion: true,
      condition: "Sun warming begins breaking shallow boundary layer",
      recommendation: "Inversion beginning to disperse. Keep air purifiers running indoors."
    },
    {
      hour: "12:00",
      aqi: 310,
      cpcbAqi: 310,
      epaAqi: 230,
      category: "Very Unhealthy",
      pm25: 180,
      pm10: 290,
      temperature: 21.5,
      humidity: 58,
      windSpeed: 5.2,
      temperatureInversion: false,
      condition: "Warming boundary layer; dispersing particles",
      recommendation: "Vertical air mixing accelerating. Particulate dropping towards daily minimum."
    },
    {
      hour: "14:00",
      aqi: 240,
      cpcbAqi: 240,
      epaAqi: 194,
      category: "Unhealthy",
      pm25: 140,
      pm10: 220,
      temperature: 23.0,
      humidity: 50,
      windSpeed: 6.5,
      temperatureInversion: false,
      condition: "Optimal afternoon solar mixing window",
      recommendation: "Safest window of the day. Brief 15-20 min cross-ventilation flush recommended, followed by re-sealing."
    },
    {
      hour: "16:00",
      aqi: 285,
      cpcbAqi: 285,
      epaAqi: 218,
      category: "Unhealthy",
      pm25: 168,
      pm10: 260,
      temperature: 21.0,
      humidity: 56,
      windSpeed: 4.8,
      temperatureInversion: false,
      condition: "Evening cooling begins; winds dropping",
      recommendation: "Solar mixing ending. Reseal all windows before evening rush hour begins."
    },
    {
      hour: "18:00",
      aqi: 360,
      cpcbAqi: 360,
      epaAqi: 270,
      category: "Very Unhealthy",
      pm25: 220,
      pm10: 350,
      temperature: 18.5,
      humidity: 68,
      windSpeed: 2.8,
      temperatureInversion: true,
      condition: "Evening rush hour & secondary inversion formation",
      recommendation: "Evening tailpipe surge. Turn on kitchen exhaust for cooking; seal door threshold gaps."
    },
    {
      hour: "20:00",
      aqi: 390,
      cpcbAqi: 390,
      epaAqi: 298,
      category: "Hazardous",
      pm25: 248,
      pm10: 390,
      temperature: 16.0,
      humidity: 76,
      windSpeed: 2.0,
      temperatureInversion: true,
      condition: "Trapped surface emissions & falling boundary height",
      recommendation: "Avoid any outdoor activity. Keep children and seniors in rooms with active filtration."
    },
    {
      hour: "22:00",
      aqi: 415,
      cpcbAqi: 415,
      epaAqi: 315,
      category: "Hazardous",
      pm25: 265,
      pm10: 420,
      temperature: 14.5,
      humidity: 82,
      windSpeed: 1.5,
      temperatureInversion: true,
      condition: "Dense nocturnal haze layer",
      recommendation: "Close bedroom door to restrict volume; operate room purifier or Corsi-Rosenthal fan on sleep mode."
    },
    {
      hour: "00:00",
      aqi: 425,
      cpcbAqi: 425,
      epaAqi: 325,
      category: "Hazardous",
      pm25: 275,
      pm10: 430,
      temperature: 13.8,
      humidity: 85,
      windSpeed: 1.2,
      temperatureInversion: true,
      condition: "Near zero surface dispersion",
      recommendation: "Complete overnight isolation. Maintain filtered indoor air below 25 µg/m³ for lung recovery."
    }
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
    const timeout = setTimeout(() => controller.abort(), 6500);

    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi&hourly=pm10,pm2_5,us_aqi&timezone=auto`;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure,visibility&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=sunrise,sunset&timezone=auto`;

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
    let so2 = 13;
    let liveUsAqi: number | null = null;
    let hourlyTimes: string[] = [];
    let hourlyPm25: number[] = [];
    let hourlyPm10: number[] = [];
    let hourlyUsAqi: number[] = [];

    if (aqiRes.status === "fulfilled" && aqiRes.value.ok) {
      const data = await aqiRes.value.json();
      currentPm25 = Number(data.current?.pm2_5 ?? 140);
      currentPm10 = Number(data.current?.pm10 ?? 180);
      no2 = Number(data.current?.nitrogen_dioxide ?? 50);
      co = Number((data.current?.carbon_monoxide ? data.current.carbon_monoxide / 1000 : 1.2).toFixed(1));
      o3 = Number(data.current?.ozone ?? 30);
      so2 = Number(data.current?.sulphur_dioxide ?? 13);
      if (data.current?.us_aqi !== undefined && data.current?.us_aqi !== null) {
        liveUsAqi = Math.round(Number(data.current.us_aqi));
      }
      hourlyTimes = data.hourly?.time || [];
      hourlyPm25 = data.hourly?.pm2_5 || [];
      hourlyPm10 = data.hourly?.pm10 || [];
      hourlyUsAqi = data.hourly?.us_aqi || [];
    }

    let temp = 17.5;
    let humidity = 80;
    let windSpeed = 3.0;
    let surfacePressure = 1017;
    let visibilityKm = 16;
    let sunrise = "06:12";
    let sunset = "16:58";
    let hourlyTemp: number[] = [];
    let hourlyHumidity: number[] = [];
    let hourlyWind: number[] = [];

    if (weatherRes.status === "fulfilled" && weatherRes.value.ok) {
      const wData = await weatherRes.value.json();
      temp = Number(wData.current?.temperature_2m ?? 17.5);
      humidity = Number(wData.current?.relative_humidity_2m ?? 80);
      windSpeed = Number(wData.current?.wind_speed_10m ?? 3.0);
      surfacePressure = Number(wData.current?.surface_pressure ? Math.round(wData.current.surface_pressure) : 1017);
      visibilityKm = Number(wData.current?.visibility ? Math.round((wData.current.visibility / 1000) * 10) / 10 : 16);
      if (wData.daily?.sunrise?.[0]) {
        sunrise = wData.daily.sunrise[0].split("T")[1]?.slice(0, 5) || "06:12";
      }
      if (wData.daily?.sunset?.[0]) {
        sunset = wData.daily.sunset[0].split("T")[1]?.slice(0, 5) || "16:58";
      }
      hourlyTemp = wData.hourly?.temperature_2m || [];
      hourlyHumidity = wData.hourly?.relative_humidity_2m || [];
      hourlyWind = wData.hourly?.wind_speed_10m || [];
    }

    const { cpcbAqi, cpcbCategory, epaAqi, epaCategory } = calculateBothAQI(currentPm25);
    const finalEpaAqi = liveUsAqi !== null && liveUsAqi > 0 ? liveUsAqi : epaAqi;

    // Primary pollutant detection: Compare PM2.5 vs PM10 vs NO2
    let primaryPollutant: 'PM2.5' | 'PM10' | 'NO2' = "PM2.5";
    if (currentPm10 > currentPm25 * 2.2) {
      primaryPollutant = "PM10";
    }

    // Temperature Inversion detection: Low surface wind + winter ground temperature
    const temperatureInversion = windSpeed < 6.0 && temp < 23;

    // Build rich 24-hour forecast array
    const forecastHourly: HourlyForecastItem[] = [];
    const nowHour = new Date().getHours();

    let startIndex = 0;
    if (hourlyTimes.length > 0) {
      const nowStr = new Date().toISOString().slice(0, 13);
      const matchIdx = hourlyTimes.findIndex(t => t.startsWith(nowStr));
      if (matchIdx !== -1) startIndex = matchIdx;
    }

    const count = Math.min(24, Math.max(12, hourlyTimes.length - startIndex));
    for (let i = 0; i < count; i++) {
      const idx = startIndex + i;
      const timeStr = hourlyTimes[idx];
      const hourPart = timeStr ? timeStr.split("T")[1]?.slice(0, 5) : `${(nowHour + i) % 24}:00`;
      const valPm25 = Math.round(hourlyPm25[idx] || currentPm25);
      const valPm10 = Math.round(hourlyPm10[idx] || (valPm25 * 1.5));
      const valTemp = hourlyTemp[idx] !== undefined ? Math.round(hourlyTemp[idx] * 10) / 10 : temp;
      const valHumidity = hourlyHumidity[idx] !== undefined ? Math.round(hourlyHumidity[idx]) : humidity;
      const valWind = hourlyWind[idx] !== undefined ? Math.round(hourlyWind[idx] * 10) / 10 : windSpeed;
      const hourNum = parseInt(hourPart.split(":")[0]);
      const hourInversion = valWind < 6.0 && valTemp < 23 && (hourNum < 11 || hourNum > 17);

      const both = calculateBothAQI(valPm25);
      const hourEpa = hourlyUsAqi[idx] || both.epaAqi;

      let condition = "Moderate dispersion";
      let recommendation = "Standard clean air precautions.";

      if (hourNum >= 5 && hourNum <= 9) {
        condition = "Morning boundary inversion peak";
        recommendation = "Morning ground inversion traps vehicle soot. Avoid outdoor exercise; keep windows shut.";
      } else if (hourNum > 9 && hourNum <= 12) {
        condition = "Mid-morning traffic corridor";
        recommendation = "High traffic emissions. Wear sealed N95 respirator if stepping out.";
      } else if (hourNum > 12 && hourNum <= 16) {
        condition = "Afternoon solar mixing window (Daily PM2.5 minimum)";
        recommendation = "Safest window of the day. Ideal for brief 15-20 min cross-ventilation flush.";
      } else if (hourNum > 16 && hourNum <= 20) {
        condition = "Evening rush hour & cooling ingress";
        recommendation = "Evening emissions rising. Keep kitchen exhaust on; seal door gaps.";
      } else {
        condition = "Dense nocturnal smog layer";
        recommendation = "Low nocturnal boundary layer. Keep bedroom sealed with active air filtration.";
      }

      forecastHourly.push({
        hour: hourPart,
        aqi: both.cpcbAqi,
        cpcbAqi: both.cpcbAqi,
        epaAqi: hourEpa,
        category: both.cpcbCategory,
        pm25: valPm25,
        pm10: valPm10,
        temperature: valTemp,
        humidity: valHumidity,
        windSpeed: valWind,
        temperatureInversion: hourInversion,
        condition,
        recommendation
      });
    }

    // Determine the minimum PM2.5 window for safe outdoor/ventilation
    let bestWindowStart = "13:30";
    let bestWindowEnd = "15:30";
    let bestAqi = Math.max(80, Math.round(cpcbAqi * 0.7));

    if (forecastHourly.length >= 6) {
      let minVal = Infinity;
      let minHour = "14:00";
      forecastHourly.forEach(f => {
        const h = parseInt(f.hour.split(":")[0]);
        if (h >= 11 && h <= 17 && f.pm25 < minVal) {
          minVal = f.pm25;
          minHour = f.hour;
        }
      });
      if (minVal !== Infinity) {
        bestAqi = calculateBothAQI(minVal).cpcbAqi;
        const h = parseInt(minHour.split(":")[0]);
        bestWindowStart = `${String(h).padStart(2, "0")}:00`;
        bestWindowEnd = `${String(h + 2).padStart(2, "0")}:00`;
      }
    }

    return {
      aqi: cpcbAqi,
      cpcbAqi,
      epaAqi: finalEpaAqi,
      category: cpcbCategory,
      primaryPollutant,
      pm25: Math.round(currentPm25),
      pm10: Math.round(currentPm10),
      no2,
      co,
      o3,
      so2,
      temperature: Math.round(temp * 10) / 10,
      humidity: Math.round(humidity),
      windSpeed: Math.round(windSpeed * 10) / 10,
      surfacePressure,
      visibilityKm,
      sunrise,
      sunset,
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
    logger.warn("AQI fetch failed or timed out, using fallback dataset:", err);
    return {
      ...FALLBACK_AQI_DATA,
      timestamp: new Date().toISOString(),
      isFallback: true
    };
  }
}

/**
 * Calibrate AQIData with a manual ground sensor reading or mobile reading
 */
export function calibrateAQIData(
  base: AQIData,
  manualPm25: number,
  standard: AQIStandard = 'cpcb',
  note: string = "Calibrated to handheld / mobile app sensor"
): AQIData {
  const { cpcbAqi, cpcbCategory, epaAqi, epaCategory } = calculateBothAQI(manualPm25);
  const selectedAqi = standard === 'epa' ? epaAqi : cpcbAqi;
  const selectedCat = standard === 'epa' ? epaCategory : cpcbCategory;
  const ratio = (base.pm25 > 0 ? manualPm25 / base.pm25 : 1);

  const calibratedHourly = (base.forecastHourly || []).map(f => {
    const adjustedPm25 = Math.max(1, Math.round(f.pm25 * ratio));
    const both = calculateBothAQI(adjustedPm25);
    return {
      ...f,
      pm25: adjustedPm25,
      cpcbAqi: both.cpcbAqi,
      epaAqi: both.epaAqi,
      aqi: standard === 'epa' ? both.epaAqi : both.cpcbAqi,
      category: standard === 'epa' ? both.epaCategory : both.cpcbCategory
    };
  });

  return {
    ...base,
    pm25: manualPm25,
    cpcbAqi,
    epaAqi,
    aqi: selectedAqi,
    category: selectedCat,
    forecastHourly: calibratedHourly,
    isCalibrated: true,
    calibratedNote: note
  };
}
