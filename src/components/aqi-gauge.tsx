"use client";

import React from "react";
import { AQIData } from "@/types";
import { Wind, Droplets, Thermometer, AlertTriangle, ShieldCheck, Clock, Sparkles } from "lucide-react";

interface AqiGaugeProps {
  data: AQIData;
  language?: 'en' | 'hi';
}

export function AqiGauge({ data, language = 'en' }: AqiGaugeProps) {
  const isHi = language === 'hi';
  const aqi = data.aqi;

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

  const theme = getTheme(aqi);

  // Gauge calculation (0 to 500 mapped to 0 to 180 degrees)
  const clampedAqi = Math.min(500, Math.max(0, aqi));
  const rotationAngle = (clampedAqi / 500) * 180 - 90;

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-xl relative overflow-hidden">
      {/* Background radial glow */}
      <div 
        className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: theme.color }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {isHi ? "वर्तमान वायु गुणवत्ता सूचकांक" : "Live Air Quality Index"}
          </span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {theme.label}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block">{data.source}</span>
          <span className="text-[11px] text-emerald-400 font-mono flex items-center justify-end gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Live Synced
          </span>
        </div>
      </div>

      {/* Visual Semi-Circle Gauge */}
      <div className="flex flex-col items-center justify-center my-2">
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
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* AQI Big Number Display */}
          <div className="relative z-10 text-center mb-1">
            <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
              {aqi}
            </span>
            <span className="text-xs font-semibold text-slate-400 block -mt-1">
              AQI (CPCB / EPA)
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 text-center max-w-sm mt-3 px-2">
          {theme.desc}
        </p>
      </div>

      {/* Temperature Inversion Alert Banner if active */}
      {data.temperatureInversion && (
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-amber-300 block">
              {isHi ? "तापमान व्युत्क्रमण (Inversion) सक्रिय" : "Atmospheric Inversion Active"}
            </span>
            <span className="text-slate-300">
              {isHi
                ? "ठंडी सतही हवा के कारण धुआं जमीन से सटा हुआ है। सुबह 11:30 बजे से पहले बाहर भारी व्यायाम न करें।"
                : "Nocturnal ground cooling is trapping vehicle soot and smoke in a low boundary layer. Expect peak pollution until noon."}
            </span>
          </div>
        </div>
      )}

      {/* Key Pollutants Grid */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-surface-border">
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">PM2.5 (Fine)</span>
          <span className="text-base font-bold text-white font-mono">{data.pm25}</span>
          <span className="text-[10px] text-slate-400 block">µg/m³</span>
        </div>
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">PM10 (Coarse)</span>
          <span className="text-base font-bold text-slate-200 font-mono">{data.pm10}</span>
          <span className="text-[10px] text-slate-400 block">µg/m³</span>
        </div>
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Weather / Wind</span>
          <span className="text-base font-bold text-cyan-300 font-mono">{data.windSpeed}</span>
          <span className="text-[10px] text-slate-400 block">km/h · {data.temperature}°C</span>
        </div>
      </div>

      {/* Best Windows Pill */}
      {data.safeVentilationWindows?.length > 0 && (
        <div className="mt-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-200">
              {isHi ? "सर्वोत्तम वेंटिलेशन समय:" : "Best Ventilation Window:"} 
              <strong className="text-cyan-300 ml-1">
                {data.safeVentilationWindows[0].start} - {data.safeVentilationWindows[0].end}
              </strong>
            </span>
          </div>
          <span className="text-[10px] bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded-full font-semibold">
            {isHi ? "दोपहर" : "Afternoon"}
          </span>
        </div>
      )}

      {/* Hourly Trend / Mini Forecast */}
      {data.forecastHourly?.length > 0 && (
        <div className="mt-4 pt-3 border-t border-surface-border">
          <span className="text-xs font-semibold text-slate-400 block mb-2">
            {isHi ? "घंटेवार पूर्वानुमान" : "Hourly AQI Forecast"}
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {data.forecastHourly.slice(0, 8).map((f, idx) => {
              const miniTheme = getTheme(f.aqi);
              return (
                <div
                  key={idx}
                  className="shrink-0 bg-slate-900/80 border border-slate-800 p-2 rounded-xl text-center min-w-[62px]"
                >
                  <span className="text-[10px] text-slate-400 block">{f.hour}</span>
                  <span 
                    className="text-xs font-bold font-mono block my-0.5"
                    style={{ color: miniTheme.color }}
                  >
                    {f.aqi}
                  </span>
                  <span className="text-[9px] text-slate-500 block">
                    {f.pm25} µg
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
