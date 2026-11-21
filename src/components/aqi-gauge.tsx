"use client";

import React, { useState } from "react";
import { AQIData, HourlyForecastItem } from "@/types";
import { useApp } from "@/context/app-context";
import { 
  Wind, 
  Droplets, 
  Thermometer, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  RotateCcw,
  Sliders,
  Calendar,
  HelpCircle,
  X,
  Check,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  ShieldCheck,
  Info,
  Building2,
  Loader2
} from "lucide-react";
import { logger } from "@/lib/logger";

interface AqiGaugeProps {
  data: AQIData;
  language?: 'en' | 'hi';
  onOpenLocationSelector?: () => void;
}

export function AqiGauge({ data, language = 'en', onOpenLocationSelector }: AqiGaugeProps) {
  const { profile, aqiStandard, setAqiStandard, manualPm25, calibrateSensor } = useApp();
  const isHi = language === 'hi';
  const [selectedHourIndex, setSelectedHourIndex] = useState<number | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showCalibrateModal, setShowCalibrateModal] = useState(false);
  const [showStationModal, setShowStationModal] = useState(false);
  const [stationData, setStationData] = useState<{ city: string; stations: string[]; keyFactors: string[]; summary?: string } | null>(null);
  const [stationLoading, setStationLoading] = useState(false);
  const [customPmInput, setCustomPmInput] = useState<string>(String(data.pm25 || 182));

  const handleOpenStations = async () => {
    setShowStationModal(true);
    const city = profile.locationName.split("(")[0].split(",")[0].trim() || "Patna";
    setStationLoading(true);
    try {
      const res = await fetch(`/api/station-lookup?city=${encodeURIComponent(city)}`);
      if (res.ok) {
        const json = await res.json();
        setStationData(json);
      }
    } catch (e) {
      logger.warn("Station lookup error:", e);
    } finally {
      setStationLoading(false);
    }
  };

  // Determine which data point to display (Live current vs Selected hour)
  const isTimeTraveling = selectedHourIndex !== null && data.forecastHourly && data.forecastHourly[selectedHourIndex];
  const activeHourlyItem = isTimeTraveling ? data.forecastHourly[selectedHourIndex] : null;

  // Dual standard active AQI
  const displayAqi = activeHourlyItem
    ? (aqiStandard === 'epa' ? (activeHourlyItem.epaAqi ?? activeHourlyItem.aqi) : (activeHourlyItem.cpcbAqi ?? activeHourlyItem.aqi))
    : (aqiStandard === 'epa' ? (data.epaAqi ?? data.aqi) : (data.cpcbAqi ?? data.aqi));

  const displayPm25 = activeHourlyItem ? activeHourlyItem.pm25 : data.pm25;
  const displayPm10 = activeHourlyItem ? (activeHourlyItem.pm10 ?? Math.round(activeHourlyItem.pm25 * 1.5)) : data.pm10;
  const displayTemp = activeHourlyItem?.temperature !== undefined ? activeHourlyItem.temperature : data.temperature;
  const displayWind = activeHourlyItem?.windSpeed !== undefined ? activeHourlyItem.windSpeed : data.windSpeed;
  const displayHumidity = activeHourlyItem?.humidity !== undefined ? activeHourlyItem.humidity : data.humidity;
  const displayInversion = activeHourlyItem?.temperatureInversion !== undefined ? activeHourlyItem.temperatureInversion : data.temperatureInversion;
  const displayCondition = activeHourlyItem?.condition;
  const displayRecommendation = activeHourlyItem?.recommendation;
  const displayHourLabel = activeHourlyItem ? activeHourlyItem.hour : (isHi ? "वर्तमान लाइव समय" : "Live Current");

  // Determine styling and label based on AQI level
  const getTheme = (aqiVal: number) => {
    if (aqiVal <= 50) {
      return {
        label: isHi ? "अच्छा (Good)" : "Good",
        color: "#10b981",
        textColor: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/30",
        desc: isHi ? "हवा की गुणवत्ता संतोषजनक है।" : "Air quality is considered satisfactory; air pollution poses little or no risk."
      };
    } else if (aqiVal <= 100) {
      return {
        label: isHi ? "मध्यम (Moderate)" : "Moderate",
        color: "#f59e0b",
        textColor: "text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/30",
        desc: isHi ? "संवेदनशील व्यक्तियों को सांस लेने में हल्की परेशानी हो सकती है।" : "Air quality is acceptable; unusually sensitive individuals may experience minor symptoms."
      };
    } else if (aqiVal <= 200) {
      return {
        label: isHi ? "संवेदनशील वर्ग हेतु अस्वस्थ" : "Unhealthy for Sensitive Groups",
        color: "#f97316",
        textColor: "text-orange-400",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/30",
        desc: isHi ? "बच्चों, बुजुर्गों और अस्थमा रोगियों को बाहर जाने से बचना चाहिए।" : "Members of sensitive groups may experience health effects. General public less likely affected."
      };
    } else if (aqiVal <= 300) {
      return {
        label: isHi ? "अस्वस्थ (Unhealthy)" : "Unhealthy",
        color: "#ef4444",
        textColor: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        desc: isHi ? "सभी लोगों को सांस लेने में तकलीफ हो सकती है। N95 मास्क पहनें।" : "Everyone may begin to experience health effects; sensitive groups may experience serious effects."
      };
    } else if (aqiVal <= 400) {
      return {
        label: isHi ? "अत्यधिक अस्वस्थ (Very Unhealthy)" : "Very Unhealthy",
        color: "#8b5cf6",
        textColor: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/30",
        desc: isHi ? "स्वास्थ्य आपातकाल की स्थिति। सभी बाहरी शारीरिक गतिविधियां बंद रखें।" : "Health alert: risk of health effects is increased for everyone. Strictly avoid outdoor exercise."
      };
    } else {
      return {
        label: isHi ? "अति गंभीर / खतरनाक (Hazardous)" : "Hazardous / Severe+",
        color: "#e11d48",
        textColor: "text-rose-400",
        bgColor: "bg-rose-950/40",
        borderColor: "border-rose-600/50",
        desc: isHi ? "आपातकालीन स्वास्थ्य चेतावनी। सभी लोग घर के अंदर रहें और प्यूरीफायर चलाएं।" : "Health warning of emergency conditions: the entire population is more likely to be affected."
      };
    }
  };

  const theme = getTheme(displayAqi);
  const clampedAqi = Math.min(500, Math.max(0, displayAqi));

  const handleApplyCalibration = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customPmInput);
    if (!isNaN(val) && val >= 0) {
      calibrateSensor(val, `Calibrated to user sensor (${val} µg/m³)`);
      setShowCalibrateModal(false);
    }
  };

  const handleResetCalibration = () => {
    calibrateSensor(null);
    setCustomPmInput(String(data.pm25));
    setShowCalibrateModal(false);
  };

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-xl relative overflow-hidden space-y-4">
      {/* Background radial glow */}
      <div 
        className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: theme.color }}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {isTimeTraveling ? (isHi ? `समय: ${displayHourLabel}` : `Selected Hour: ${displayHourLabel}`) : (isHi ? "वायु गुणवत्ता सूचकांक" : "Air Quality Index")}
            </span>
            {isTimeTraveling && (
              <span className="text-[10px] bg-cyan-950 border border-cyan-800 text-cyan-300 px-2 py-0.5 rounded-full font-mono font-bold">
                Time-Travel
              </span>
            )}
            {data.isCalibrated && (
              <span className="text-[10px] bg-amber-950 border border-amber-800 text-amber-300 px-2 py-0.5 rounded-full font-mono font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Phone Calibrated
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
            {theme.label}
          </h2>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>✨ Gemini AI Active</span>
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-0.5 truncate max-w-[160px]">
            {data.source || "Open-Meteo Air Quality API"}
          </span>
          {isTimeTraveling && (
            <button
              onClick={() => setSelectedHourIndex(null)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 ml-auto mt-0.5"
            >
              <RotateCcw className="w-3 h-3" />
              {isHi ? "लाइव पर लौटें" : "Reset to Live"}
            </button>
          )}
        </div>
      </div>

      {/* Dual Standard Switcher & Info Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-b border-surface-border/60 pb-3">
        {/* Toggle between CPCB India and US EPA / AccuWeather */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setAqiStandard("cpcb")}
            aria-label="Switch to India CPCB National AQI standard"
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              aqiStandard === "cpcb"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🇮🇳 India CPCB</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/30">
              {activeHourlyItem ? (activeHourlyItem.cpcbAqi ?? activeHourlyItem.aqi) : (data.cpcbAqi ?? data.aqi)}
            </span>
          </button>
          <button
            onClick={() => setAqiStandard("epa")}
            aria-label="Switch to US EPA / AccuWeather AQI standard"
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              aqiStandard === "epa"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🇺🇸 US EPA / AccuWeather</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/30">
              {activeHourlyItem ? (activeHourlyItem.epaAqi ?? activeHourlyItem.aqi) : (data.epaAqi ?? data.aqi)}
            </span>
          </button>
        </div>

        {/* Explain / Calibrate / Stations buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setShowInfoModal(true)}
            aria-label="Learn why phone apps show different AQI than CPCB stations"
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-cyan-400 text-xs font-medium flex items-center gap-1.5 transition"
            title="Learn why phone apps show 182 while CPCB shows 335"
          >
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isHi ? "फ़ोन में 182 क्यों?" : "Why phone says 182?"}</span>
          </button>

          <button
            onClick={handleOpenStations}
            aria-label="View official CPCB and State Board Continuous Ambient Air Quality Monitoring Stations"
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-emerald-400 text-xs font-medium flex items-center gap-1.5 transition"
            title="View official CPCB Continuous Ambient Air Quality Monitoring Stations"
          >
            <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isHi ? "स्टेशन जानकारी" : "Stations"}</span>
          </button>

          <button
            onClick={() => setShowCalibrateModal(true)}
            aria-label="Sync and calibrate dashboard with phone or sensor reading"
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-amber-400 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Sliders className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{data.isCalibrated ? (isHi ? "कैलिब्रेटेड" : "Calibrated") : (isHi ? "फ़ोन सिंक" : "Sync Phone")}</span>
          </button>
        </div>
      </div>

      {/* Visual Semi-Circle Gauge */}
      <div className="flex flex-col items-center justify-center my-2">
        <div className="relative w-64 sm:w-72 flex flex-col items-center justify-center">
          <svg className="w-full h-auto overflow-visible" viewBox="0 0 240 135">
            {/* Background Arch Track */}
            <path
              d="M 28 120 A 92 92 0 0 1 212 120"
              fill="none"
              stroke="#1e293b"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Colored Active Progress Arc */}
            <path
              d="M 28 120 A 92 92 0 0 1 212 120"
              fill="none"
              stroke={theme.color}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={289.03}
              strokeDashoffset={289.03 * (1 - Math.min(1, Math.max(0, clampedAqi / 500)))}
              className="transition-all duration-700 ease-out"
            />
            {/* Gauge End Labels */}
            <text x="28" y="133" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="600">0</text>
            <text x="120" y="22" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="600">250</text>
            <text x="212" y="133" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="600">500+</text>

            {/* AQI Big Number Display inside SVG for perfect centering */}
            <text x="120" y="90" textAnchor="middle" fill="#ffffff" fontSize="38" fontWeight="800" fontFamily="monospace">
              {displayAqi}
            </text>
            <text x="120" y="110" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontWeight="600">
              {aqiStandard === "epa" ? "US EPA Scale" : "CPCB India Scale"} · {displayHourLabel}
            </text>
          </svg>
        </div>

        <p className="text-xs text-slate-300 text-center max-w-sm mt-3 px-2">
          {theme.desc}
        </p>

        {/* Quick comparison pill */}
        <div className="mt-2 text-[11px] text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full flex items-center gap-2">
          <span>🇮🇳 CPCB: <strong className="text-white">{data.cpcbAqi ?? data.aqi}</strong></span>
          <span className="text-slate-600">|</span>
          <span>🇺🇸 EPA/AccuWeather: <strong className="text-white">{data.epaAqi ?? data.aqi}</strong></span>
          <span className="text-slate-600">|</span>
          <span>PM2.5: <strong className="text-cyan-300">{displayPm25} µg/m³</strong></span>
        </div>
      </div>

      {/* Time-Specific Atmospheric Inversion / Condition Banner */}
      {displayInversion ? (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-amber-300 block">
              {isHi ? `तापमान व्युत्क्रमण (Inversion) सक्रिय - ${displayHourLabel}` : `Atmospheric Inversion Active at ${displayHourLabel}`}
            </span>
            <span className="text-slate-300">
              {displayRecommendation || (isHi
                ? "ठंडी सतही हवा के कारण धुआं जमीन से सटा हुआ है। बाहर भारी व्यायाम न करें और खिड़कियां बंद रखें।"
                : "Nocturnal ground cooling is trapping vehicle soot and smoke in a shallow boundary layer.")}
            </span>
          </div>
        </div>
      ) : displayRecommendation ? (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-300 block">
              {isHi ? `${displayHourLabel} की सिफारिश:` : `Protocol for ${displayHourLabel}:`}
            </span>
            <span className="text-slate-300">{displayRecommendation}</span>
          </div>
        </div>
      ) : null}

      {/* COMPLETE TELEMETRY GRID: Matching User's Mobile App */}
      <div className="space-y-2 pt-2 border-t border-surface-border">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          {isHi ? "प्रदूषक व मौसम टेलीमेट्री (Live Pollutants & Telemetry)" : "Live Telemetry & Atmospheric Metrics"}
        </span>

        {/* Row 1: Key Pollutants */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[9px] text-pink-400 font-bold uppercase block">PM2.5</span>
            <span className="text-sm sm:text-base font-extrabold text-white font-mono">{displayPm25}</span>
            <span className="text-[9px] text-slate-500 block">µg/m³</span>
          </div>
          <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[9px] text-amber-400 font-bold uppercase block">PM10</span>
            <span className="text-sm sm:text-base font-extrabold text-slate-200 font-mono">{displayPm10}</span>
            <span className="text-[9px] text-slate-500 block">µg/m³</span>
          </div>
          <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[9px] text-orange-400 font-bold uppercase block">CO</span>
            <span className="text-sm sm:text-base font-extrabold text-slate-200 font-mono">{data.co ?? 8}</span>
            <span className="text-[9px] text-slate-500 block">mg/m³</span>
          </div>
          <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[9px] text-emerald-400 font-bold uppercase block">SO2</span>
            <span className="text-sm sm:text-base font-extrabold text-slate-200 font-mono">{data.so2 ?? 13}</span>
            <span className="text-[9px] text-slate-500 block">µg/m³</span>
          </div>
        </div>

        {/* Row 2: Weather, Atmospheric Pressure & Visibility (Matches HuaFeng Phone View) */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[9px] text-slate-400 font-semibold uppercase block flex items-center justify-center gap-1">
              <Thermometer className="w-2.5 h-2.5 text-cyan-400" /> Temp
            </span>
            <span className="text-xs sm:text-sm font-bold text-white font-mono">{displayTemp}°C</span>
            <span className="text-[9px] text-slate-500 block">Ambient</span>
          </div>
          <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[9px] text-slate-400 font-semibold uppercase block flex items-center justify-center gap-1">
              <Droplets className="w-2.5 h-2.5 text-blue-400" /> Humidity
            </span>
            <span className="text-xs sm:text-sm font-bold text-white font-mono">{displayHumidity}%</span>
            <span className="text-[9px] text-slate-500 block">RH</span>
          </div>
          <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[9px] text-slate-400 font-semibold uppercase block flex items-center justify-center gap-1">
              <Eye className="w-2.5 h-2.5 text-slate-400" /> Visibility
            </span>
            <span className="text-xs sm:text-sm font-bold text-white font-mono">{data.visibilityKm ?? 16}</span>
            <span className="text-[9px] text-slate-500 block">km</span>
          </div>
          <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[9px] text-slate-400 font-semibold uppercase block flex items-center justify-center gap-1">
              <Gauge className="w-2.5 h-2.5 text-slate-400" /> Pressure
            </span>
            <span className="text-xs sm:text-sm font-bold text-white font-mono">{data.surfacePressure ?? 1017}</span>
            <span className="text-[9px] text-slate-500 block">hPa</span>
          </div>
        </div>

        {/* Row 3: Sun arc times */}
        <div className="flex items-center justify-between bg-slate-900/40 border border-slate-800/80 px-3 py-1.5 rounded-xl text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Sunrise className="w-3.5 h-3.5 text-amber-400" />
            <span>Sunrise: <strong className="text-white font-mono">{data.sunrise ?? "06:12"}</strong></span>
          </div>
          <div className="text-slate-500 font-mono text-[10px]">
            Wind: {displayWind} km/h
          </div>
          <div className="flex items-center gap-1.5">
            <Sunset className="w-3.5 h-3.5 text-orange-400" />
            <span>Sunset: <strong className="text-white font-mono">{data.sunset ?? "16:58"}</strong></span>
          </div>
        </div>
      </div>

      {/* Interactive Time-of-Day Scrubber / Hour Picker */}
      <div className="pt-2 border-t border-surface-border space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            {isHi ? "दिन के समय के अनुसार AQI स्तर देखें (24-Hour Scrubber):" : "AQI Level by Time of Day (24-Hour Scrubber):"}
          </span>
          {isTimeTraveling && (
            <button
              onClick={() => setSelectedHourIndex(null)}
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Live
            </button>
          )}
        </div>

        {/* Horizontal Scrollable Hour Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {/* Live Now Button */}
          <button
            onClick={() => setSelectedHourIndex(null)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
              selectedHourIndex === null
                ? "bg-emerald-950/80 border-emerald-500/70 text-emerald-300 ring-1 ring-emerald-500/40"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isHi ? "अभी (Live)" : "Live Now"}</span>
          </button>

          {/* Hourly Points */}
          {data.forecastHourly?.map((f, idx) => {
            const isSelected = selectedHourIndex === idx;
            const hourAqi = aqiStandard === 'epa' ? (f.epaAqi ?? f.aqi) : (f.cpcbAqi ?? f.aqi);
            const hourTheme = getTheme(hourAqi);
            return (
              <button
                key={idx}
                onClick={() => setSelectedHourIndex(idx)}
                className={`shrink-0 px-2.5 py-1.5 rounded-xl text-center border transition min-w-[62px] ${
                  isSelected
                    ? "bg-cyan-950/80 border-cyan-400 text-white ring-1 ring-cyan-400"
                    : "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <span className="text-[10px] text-slate-400 block font-mono">{f.hour}</span>
                <span 
                  className="text-xs font-bold font-mono block mt-0.5"
                  style={{ color: hourTheme.color }}
                >
                  {hourAqi}
                </span>
                <span className="text-[9px] text-slate-500 block">
                  {f.pm25} µg
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Best Windows Pill */}
      {data.safeVentilationWindows?.length > 0 && (
        <div className="bg-cyan-950/40 border border-cyan-800/40 rounded-xl p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-200">
              {isHi ? "सर्वोत्तम वेंटिलेशन समय:" : "Best Afternoon Ventilation Window:"} 
              <strong className="text-cyan-300 ml-1">
                {data.safeVentilationWindows[0].start} - {data.safeVentilationWindows[0].end}
              </strong>
            </span>
          </div>
          <span className="text-[10px] bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded-full font-semibold">
            {isHi ? "दैनिक न्यूनतम" : "Solar Peak"}
          </span>
        </div>
      )}

      {/* POPUP MODAL 1: Why phone says 182 vs CPCB 335 / 348 */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-surface-card border border-surface-border rounded-2xl p-5 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isHi ? "फ़ोन में 182 और यहाँ 335 क्यों दिख रहा है?" : "Why Phone Shows 182 and CPCB Shows 335 / 348"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Scientific breakdown of AQI calculation scales
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span>📱 Phone Weather App (HuaFeng / AccuWeather / US EPA Scale)</span>
                </div>
                <p>
                  Most mobile weather apps (Xiaomi, Vivo, Oppo, Apple) use the <strong>US EPA Global AQI index</strong> or directly show the <strong>PM2.5 concentration (182 µg/m³)</strong> as the AQI score.
                </p>
                <p className="font-mono text-cyan-300">
                  PM2.5 = 182 µg/m³ ➔ EPA AQI = 182 - 232 (&quot;Very Unhealthy&quot;)
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <span>🇮🇳 Central Pollution Control Board (CPCB India NAQI)</span>
                </div>
                <p>
                  India&apos;s official National AQI scale uses strict linear interpolation across 6 health bands. For PM2.5 between 121 and 250 µg/m³:
                </p>
                <p className="font-mono text-emerald-300 bg-slate-950 p-2 rounded">
                  AQI = 301 + [(400 - 301) / (250 - 120)] × (PM2.5 - 120)<br />
                  For PM2.5 = 165 µg/m³ ➔ AQI = 335<br />
                  For PM2.5 = 182 µg/m³ ➔ AQI = 348 (&quot;Very Poor&quot;)
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
                <strong className="block text-emerald-300 mb-1">Conclusion:</strong>
                Both numbers describe the <strong>exact same air</strong>! Your phone reports 182 using the US EPA / direct concentration scale, while Indian government monitoring reports 335–348 using the National AQI scale.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border">
              <button
                onClick={() => {
                  setAqiStandard("epa");
                  setShowInfoModal(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  aqiStandard === "epa" ? "bg-cyan-600 text-white border-cyan-500" : "bg-slate-900 text-slate-300 border-slate-800"
                }`}
              >
                Use US EPA (182)
              </button>
              <button
                onClick={() => {
                  setAqiStandard("cpcb");
                  setShowInfoModal(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  aqiStandard === "cpcb" ? "bg-cyan-600 text-white border-cyan-500" : "bg-slate-900 text-slate-300 border-slate-800"
                }`}
              >
                Use India CPCB (335)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL 2: Sensor / Phone Calibration */}
      {showCalibrateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-surface-card border border-surface-border rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isHi ? "फ़ोन या सेंसर रीडिंग से सिंक करें" : "Sync Handheld Sensor / Phone"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Calibrate all SmogShield calculations to your exact reading
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCalibrateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyCalibration} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Enter PM2.5 Reading (µg/m³) from your phone / handheld monitor:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="999"
                    value={customPmInput}
                    onChange={(e) => setCustomPmInput(e.target.value)}
                    placeholder="e.g. 182"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400">µg/m³</span>
                </div>
              </div>

              {/* Quick pre-fill buttons */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Quick fill:</span>
                <button
                  type="button"
                  onClick={() => setCustomPmInput("182")}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-pink-300 font-mono"
                >
                  182 (Patna Mobile)
                </button>
                <button
                  type="button"
                  onClick={() => setCustomPmInput("164")}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono"
                >
                  164
                </button>
                <button
                  type="button"
                  onClick={() => setCustomPmInput("75")}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono"
                >
                  75
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                SmogShield will instantly recalculate both Indian CPCB and US EPA AQI, mask recommendations, indoor purifier requirements, and health impact for your household.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border">
                {data.isCalibrated && (
                  <button
                    type="button"
                    onClick={handleResetCalibration}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Reset to Live API
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950 transition"
                >
                  Apply Calibration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* POPUP MODAL 3: Official CAAQMS Stations for active city */}
      {showStationModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-surface-card border border-surface-border rounded-2xl p-5 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {profile.locationName.split("(")[0]} · {isHi ? "आधिकारिक CAAQMS मॉनिटरिंग स्टेशन" : "Official CAAQMS Stations"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Central Pollution Control Board (CPCB) & State PCB Network
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowStationModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {stationLoading ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                <span>Fetching official CAAQMS station intelligence...</span>
              </div>
            ) : stationData ? (
              <div className="space-y-3 text-xs text-slate-300">
                {stationData.summary && (
                  <p className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
                    {stationData.summary}
                  </p>
                )}

                <div>
                  <span className="font-bold text-emerald-300 block mb-1.5 uppercase text-[10px] tracking-wider">
                    Continuous Ambient Air Monitoring Stations:
                  </span>
                  <div className="space-y-1.5">
                    {stationData.stations?.map((st, i) => (
                      <div key={i} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-white font-medium">{st}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-amber-300 block mb-1.5 uppercase text-[10px] tracking-wider">
                    Local Winter Topography & Air-Shed Factors:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800">
                    {stationData.keyFactors?.map((fac, i) => (
                      <li key={i}>{fac}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-2 border-t border-surface-border text-[11px] text-slate-400">
              <span>Source: CPCB National Ambient Air Quality Grid</span>
              <button
                onClick={() => setShowStationModal(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}