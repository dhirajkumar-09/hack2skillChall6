"use client";

import React, { useState } from "react";
import { AQIData, HourlyForecastItem } from "@/types";
import { 
  Wind, 
  Droplets, 
  Thermometer, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  RotateCcw,
  Sliders,
  Calendar
} from "lucide-react";

interface AqiGaugeProps {
  data: AQIData;
  language?: 'en' | 'hi';
  onOpenLocationSelector?: () => void;
}

export function AqiGauge({ data, language = 'en', onOpenLocationSelector }: AqiGaugeProps) {
  const isHi = language === 'hi';
  const [selectedHourIndex, setSelectedHourIndex] = useState<number | null>(null);

  // Determine which data point to display (Live current vs Selected hour)
  const isTimeTraveling = selectedHourIndex !== null && data.forecastHourly && data.forecastHourly[selectedHourIndex];
  const activeHourlyItem = isTimeTraveling ? data.forecastHourly[selectedHourIndex] : null;

  const displayAqi = activeHourlyItem ? activeHourlyItem.aqi : data.aqi;
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
        label: isHi ? "अच्छा" : "Good",
        color: "#10b981",
        textColor: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/30",
        desc: isHi ? "हवा की गुणवत्ता संतोषजनक है।" : "Air quality is considered satisfactory; air pollution poses little or no risk."
      };
    } else if (aqiVal <= 100) {
      return {
        label: isHi ? "मध्यम" : "Moderate",
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
        label: isHi ? "अस्वस्थ" : "Unhealthy",
        color: "#ef4444",
        textColor: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        desc: isHi ? "सभी लोगों को सांस लेने में तकलीफ हो सकती है। N95 मास्क पहनें।" : "Everyone may begin to experience health effects; sensitive groups may experience serious effects."
      };
    } else if (aqiVal <= 400) {
      return {
        label: isHi ? "अत्यधिक अस्वस्थ" : "Very Unhealthy",
        color: "#8b5cf6",
        textColor: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/30",
        desc: isHi ? "स्वास्थ्य आपातकाल की स्थिति। सभी बाहरी शारीरिक गतिविधियां बंद रखें।" : "Health alert: risk of health effects is increased for everyone. Strictly avoid outdoor exercise."
      };
    } else {
      return {
        label: isHi ? "अति गंभीर / खतरनाक" : "Hazardous / Severe+",
        color: "#e11d48",
        textColor: "text-rose-400",
        bgColor: "bg-rose-950/40",
        borderColor: "border-rose-600/50",
        desc: isHi ? "आपातकालीन स्वास्थ्य चेतावनी। सभी लोग घर के अंदर रहें और प्यूरीफायर चलाएं।" : "Health warning of emergency conditions: the entire population is more likely to be affected."
      };
    }
  };

  const theme = getTheme(displayAqi);

  // Gauge calculation (0 to 500 mapped to 0 to 180 degrees)
  const clampedAqi = Math.min(500, Math.max(0, displayAqi));

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
              {isTimeTraveling ? (isHi ? `समय: ${displayHourLabel}` : `Selected Hour: ${displayHourLabel}`) : (isHi ? "वर्तमान वायु गुणवत्ता सूचकांक" : "Live Air Quality Index")}
            </span>
            {isTimeTraveling && (
              <span className="text-[10px] bg-cyan-950 border border-cyan-800 text-cyan-300 px-2 py-0.5 rounded-full font-mono font-bold">
                Time-Travel
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
            {theme.label}
          </h2>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block line-clamp-1 max-w-[140px]">{data.source}</span>
          {isTimeTraveling ? (
            <button
              onClick={() => setSelectedHourIndex(null)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 ml-auto mt-0.5"
            >
              <RotateCcw className="w-3 h-3" />
              {isHi ? "लाइव पर लौटें" : "Reset to Live"}
            </button>
          ) : (
            <span className="text-[11px] text-emerald-400 font-mono flex items-center justify-end gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live Synced
            </span>
          )}
        </div>
      </div>

      {/* Visual Semi-Circle Gauge */}
      <div className="flex flex-col items-center justify-center my-1">
        <div className="relative w-56 h-28 flex items-end justify-center overflow-hidden">
          {/* Gauge background arc */}
          <div className="w-56 h-56 rounded-full border-[14px] border-slate-800 absolute top-0" />
          
          {/* Colored segmented arc */}
          <svg className="w-56 h-56 absolute top-0 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={theme.color}
              strokeWidth="10"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * (clampedAqi / 500) * 0.5)}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* AQI Big Number Display */}
          <div className="relative z-10 text-center mb-1">
            <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
              {displayAqi}
            </span>
            <span className="text-xs font-semibold text-slate-400 block -mt-1">
              AQI · {displayHourLabel}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 text-center max-w-sm mt-3 px-2">
          {theme.desc}
        </p>
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

      {/* Key Pollutants & Weather Telemetry Grid */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-surface-border">
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">PM2.5 (Fine)</span>
          <span className="text-base font-bold text-white font-mono">{displayPm25}</span>
          <span className="text-[10px] text-slate-400 block">µg/m³</span>
        </div>
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">PM10 (Coarse)</span>
          <span className="text-base font-bold text-slate-200 font-mono">{displayPm10}</span>
          <span className="text-[10px] text-slate-400 block">µg/m³</span>
        </div>
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Weather & Wind</span>
          <span className="text-base font-bold text-cyan-300 font-mono">{displayWind}</span>
          <span className="text-[10px] text-slate-400 block">km/h · {displayTemp}°C</span>
        </div>
      </div>

      {/* Interactive Time-of-Day Scrubber / Hour Picker */}
      <div className="pt-2 border-t border-surface-border space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            {isHi ? "दिन के समय के अनुसार AQI स्तर देखें (Hourly Time-Scrubber):" : "AQI Level by Time of Day (24-Hour Scrubber):"}
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
            const hourTheme = getTheme(f.aqi);
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
                  {f.aqi}
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
    </div>
  );
}
