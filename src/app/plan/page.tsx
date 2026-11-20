"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/app-context";
import { DailyCleanAirPlan, PlanActionBlock } from "@/types";
import { 
  CalendarClock, 
  ShieldCheck, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  Baby, 
  Wind, 
  RefreshCw,
  BookOpen
} from "lucide-react";
import { getTranslation } from "@/lib/i18n";

export default function PlanPage() {
  const { profile, aqiData, language, completedActions, toggleActionCompleted, geminiApiKey } = useApp();
  const [plan, setPlan] = useState<DailyCleanAirPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const t = getTranslation(language);
  const isHi = language === "hi";

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, aqiData, language, apiKey: geminiApiKey })
      });
      if (res.ok) {
        const data = await res.json();
        setPlan(data);
      }
    } catch (e) {
      console.warn("Failed to load plan API:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [profile.id, aqiData.aqi, language, geminiApiKey]);

  const getPeriodBadgeColor = (period: string) => {
    switch (period) {
      case "morning": return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "commute": return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
      case "outdoor": return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
      case "indoor": return "bg-blue-500/10 text-blue-300 border-blue-500/30";
      case "evening": return "bg-indigo-500/10 text-indigo-300 border-indigo-500/30";
      case "sleep": return "bg-purple-500/10 text-purple-300 border-purple-500/30";
      default: return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
            {isHi ? "AI दिनचर्या योजना" : "GenAI Clean-Air Plan"}
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
            {t.plan.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-lg">
            {t.plan.subtitle} ({profile.name.split("(")[0]})
          </p>
        </div>
        <button
          onClick={fetchPlan}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>{isHi ? "रीफ्रेश" : "Regenerate"}</span>
        </button>
      </div>

      {loading && (
        <div className="p-8 text-center bg-surface-card border border-surface-border rounded-2xl animate-pulse">
          <CalendarClock className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-bounce" />
          <p className="text-sm font-semibold text-white">
            {isHi ? "आज की स्वच्छ-वायु योजना तैयार की जा रही है..." : "Synthesizing Today's Personalized Clean-Air Plan..."}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Analyzing ambient AQI ({aqiData.aqi}), temperature inversion, and member health profiles.
          </p>
        </div>
      )}

      {plan && !loading && (
        <>
          {/* Plan Headline & General Advice Card */}
          <div className="bg-gradient-to-r from-slate-900 via-surface-card to-slate-900 border border-cyan-800/40 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-cyan-300 font-mono">
                  {plan.date} · AQI {aqiData.aqi}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ✨ Gemini GenAI Active
              </span>
            </div>
            <h2 className="text-base font-bold text-white mb-2 leading-snug">
              {plan.headline}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {plan.generalAdvice}
            </p>
          </div>

          {/* Mask Guidance & Children Outdoor Advice Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Mask Protocol */}
            <div className="bg-surface-card border border-surface-border rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {t.plan.maskTitle}
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 mb-2">
                <span className="text-xs font-bold text-emerald-300 block">
                  {plan.maskRecommendation.type}
                </span>
                <span className="text-[11px] text-slate-300 block mt-0.5">
                  {plan.maskRecommendation.when}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                Fit Tip: {plan.maskRecommendation.fitTip}
              </p>
            </div>

            {/* Children Guidance */}
            <div className="bg-surface-card border border-surface-border rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Baby className="w-4 h-4 text-pink-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {t.plan.outdoorPlayTitle}
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                {plan.childrenOutdoorAdvice}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                <span>{plan.ventilationStrategy}</span>
              </div>
            </div>
          </div>

          {/* Time-Blocked Routine Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              {isHi ? "समय-बद्ध कार्य योजना" : "Structured Time-Block Actions"}
            </h3>

            {plan.blocks.map((block) => {
              const isCompleted = !!completedActions[block.id];
              return (
                <div
                  key={block.id}
                  className={`rounded-2xl border transition-all p-4 ${
                    isCompleted
                      ? "bg-emerald-950/20 border-emerald-500/40"
                      : "bg-surface-card border-surface-border hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getPeriodBadgeColor(block.period)}`}>
                        {block.period}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {block.timeRange}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleActionCompleted(block.id, block)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        isCompleted
                          ? "bg-emerald-500 text-black font-bold"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                      <span>{isCompleted ? t.plan.done : t.plan.markDone}</span>
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">
                    {block.title}
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed mb-2">
                    {block.action}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 mb-3">
                    <strong className="text-slate-300 font-semibold block mb-0.5">
                      {isHi ? "कारण और वैज्ञानिक आधार:" : "Why this matters:"}
                    </strong>
                    {block.why}
                  </div>

                  {/* Impact Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                    <span className="bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 px-2 py-0.5 rounded-md font-mono">
                      -{block.impact.pm25AvoidedUg} µg PM2.5
                    </span>
                    <span className="bg-amber-950/60 border border-amber-800/60 text-amber-300 px-2 py-0.5 rounded-md font-mono">
                      -{block.impact.cigarettesAvoided} cigs equiv
                    </span>
                    {block.impact.co2eSavedKg > 0 && (
                      <span className="bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 px-2 py-0.5 rounded-md font-mono">
                        -{block.impact.co2eSavedKg} kg CO2e
                      </span>
                    )}
                    {block.impact.moneySavedInr > 0 && (
                      <span className="bg-blue-950/60 border border-blue-800/60 text-blue-300 px-2 py-0.5 rounded-md font-mono">
                        +₹{block.impact.moneySavedInr} saved
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Citations Footer */}
          {plan.citations?.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                Grounded Scientific Knowledge Sources
              </span>
              <ul className="list-disc list-inside space-y-0.5">
                {plan.citations.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
