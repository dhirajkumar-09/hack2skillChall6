"use client";

import React, { useState } from "react";
import { useApp } from "@/context/app-context";
import { INDOOR_HACKS } from "@/lib/data-store";
import { CrBoxGuide } from "@/components/cr-box-guide";
import { 
  Home, 
  Wrench, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Sliders, 
  Activity,
  Layers,
  HelpCircle
} from "lucide-react";
import { getTranslation } from "@/lib/i18n";

export default function IndoorHubPage() {
  const { aqiData, language, indoorSensorReading, setIndoorSensorReading } = useApp();
  const [activeTab, setActiveTab] = useState<"cr_box" | "hacks" | "sensor">("cr_box");
  const [sensorInput, setSensorInput] = useState<string>("");
  const isHi = language === "hi";
  const t = getTranslation(language);

  const handleSaveSensor = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(sensorInput);
    if (!isNaN(val) && val >= 0) {
      setIndoorSensorReading(val);
      setSensorInput("");
    }
  };

  // Compute Indoor to Outdoor Ratio if sensor reading exists
  const ioRatio = indoorSensorReading !== null && aqiData.pm25 > 0
    ? Number((indoorSensorReading / aqiData.pm25).toFixed(2))
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
          {isHi ? "स्वच्छ घर समाधान" : "Indoor Air Cleanliness Hub"}
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
          {t.indoor.title}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {t.indoor.subtitle}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium">
        <button
          onClick={() => setActiveTab("cr_box")}
          className={`flex-1 py-2 rounded-lg transition ${
            activeTab === "cr_box"
              ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {isHi ? "देसी प्यूरीफायर (CR Box)" : "DIY CR Box Purifier"}
        </button>
        <button
          onClick={() => setActiveTab("hacks")}
          className={`flex-1 py-2 rounded-lg transition ${
            activeTab === "hacks"
              ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {isHi ? "सस्ते घरेलू उपाय" : "Low-Cost Hacks & Myths"}
        </button>
        <button
          onClick={() => setActiveTab("sensor")}
          className={`flex-1 py-2 rounded-lg transition ${
            activeTab === "sensor"
              ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {isHi ? "इनडोर सेंसर लॉग" : "Indoor Sensor Log"}
        </button>
      </div>

      {/* Tab 1: Corsi-Rosenthal Box Fan Purifier Builder */}
      {activeTab === "cr_box" && (
        <CrBoxGuide language={language} />
      )}

      {/* Tab 2: High-Impact Low Cost Hacks & Myths */}
      {activeTab === "hacks" && (
        <div className="space-y-4">
          {INDOOR_HACKS.map((hack) => (
            <div
              key={hack.id}
              className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-xl space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                      {hack.category.replace("_", " ")}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                      {hack.reductionPotentialPercent > 0
                        ? `Up to ${hack.reductionPotentialPercent}% PM Reduction`
                        : "Science Debunked"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {hack.title}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-cyan-300 block">
                    {hack.costEstimateInr === 0 ? "₹0 (Free)" : `~₹${hack.costEstimateInr}`}
                  </span>
                  <span className="text-[10px] text-slate-400 block">{hack.difficulty} effort</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {hack.description}
              </p>

              {/* Myth vs Fact Callout */}
              {hack.mythVsFact && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
                  <div>
                    <span className="font-bold text-amber-400 block">❌ The Myth:</span>
                    <span className="text-slate-300">{hack.mythVsFact.myth}</span>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-400 block">✅ The Environmental Science:</span>
                    <span className="text-slate-300">{hack.mythVsFact.fact}</span>
                  </div>
                </div>
              )}

              {/* Action Steps */}
              {hack.steps && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    {isHi ? "क्रियान्वयन के चरण:" : "Implementation Protocol:"}
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {hack.steps.map((st, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Indoor Sensor Reading & Infiltration Ratio */}
      {activeTab === "sensor" && (
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              {isHi ? "घर के अंदर की हवा का विश्लेषण" : "Indoor Sensor & Infiltration Diagnostics"}
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            {isHi
              ? "यदि आपके पास DIY या कमर्शियल एयर क्वालिटी मॉनिटर (जैसे Kaiterra, Qingping, या DIY SDS011) है, तो रीडिंग दर्ज करें।"
              : "Enter your home sensor reading to compute your home's Indoor-to-Outdoor (I/O) penetration ratio and envelope tightness."}
          </p>

          <form onSubmit={handleSaveSensor} className="flex gap-2">
            <input
              type="number"
              placeholder="e.g. 42 (µg/m³ PM2.5)"
              value={sensorInput}
              onChange={(e) => setSensorInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs"
            >
              {isHi ? "दर्ज करें" : "Save Reading"}
            </button>
          </form>

          {indoorSensorReading !== null && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Current Indoor PM2.5</span>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {indoorSensorReading} <span className="text-xs text-slate-400">µg/m³</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Outdoor PM2.5</span>
                  <div className="text-xl font-bold text-rose-400 font-mono">
                    {aqiData.pm25} <span className="text-xs text-slate-400">µg/m³</span>
                  </div>
                </div>
              </div>

              {ioRatio !== null && (
                <div className="pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-300">Indoor/Outdoor (I/O) Ratio:</span>
                    <strong className="text-cyan-300 font-mono">{ioRatio}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                    {ioRatio <= 0.25 ? (
                      <span className="text-emerald-300 font-semibold block">
                        🛡️ Excellent Protection! Your indoor envelope and filtration are blocking ~{Math.round((1 - ioRatio) * 100)}% of outdoor toxic smog.
                      </span>
                    ) : ioRatio <= 0.5 ? (
                      <span className="text-amber-300 font-semibold block">
                        ⚠️ Moderate Infiltration. Significant outdoor smoke is penetrating door gaps. Run your purifier on high and check door weatherstripping.
                      </span>
                    ) : (
                      <span className="text-rose-300 font-semibold block">
                        🚨 Severe Infiltration! Your indoor air is almost as polluted as outdoor air. Check for open exhaust vents, unsealed windows, or burning incenses.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
