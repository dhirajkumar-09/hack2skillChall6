"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { getDetailedImpactBreakdowns } from "@/lib/impact-engine";
import { ImpactModal } from "@/components/impact-modal";
import { 
  BarChart3, 
  Sparkles, 
  Cigarette, 
  Leaf, 
  IndianRupee, 
  Flame, 
  ShieldCheck, 
  AlertCircle 
} from "lucide-react";
import { getTranslation } from "@/lib/i18n";

export default function ImpactPage() {
  const { 
    totalSavedPm25Ug, 
    totalAvoidedCigarettes, 
    totalSavedCo2Kg, 
    totalSavedMoneyInr, 
    streakDays, 
    language 
  } = useApp();

  const isHi = language === "hi";
  const t = getTranslation(language);

  const breakdowns = getDetailedImpactBreakdowns(
    totalSavedPm25Ug,
    totalAvoidedCigarettes,
    totalSavedCo2Kg * 7, // Weekly
    totalSavedMoneyInr * 7
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
          {isHi ? "पारदर्शी प्रभाव कैलकुलेटर" : "Impact Explainer & Methodology"}
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
          {t.impact.title}
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-lg">
          {t.impact.subtitle}
        </p>
      </div>

      {/* Prominent Medical & Model Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-800/50 flex items-start gap-3 shadow-lg">
        <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300">
          <strong className="text-white font-semibold block mb-0.5">
            {isHi ? "वैज्ञानिक पारदर्शिता एवं कानूनी सूचना" : "Scientific Transparency & Non-Clinical Notice"}
          </strong>
          {t.impact.medicalDisclaimer}
        </div>
      </div>

      {/* 4 Key Impact Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* PM2.5 Avoided */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {isHi ? "PM2.5 बचाव" : "PM2.5 Inhaled"}
            </span>
            <div className="p-1 rounded bg-cyan-500/10 text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-cyan-300 font-mono">
            {totalSavedPm25Ug.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            µg avoided today
          </span>
        </div>

        {/* Cigarettes Equivalent */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {isHi ? "सिगरेट समतुल्य" : "Cigarettes Equiv"}
            </span>
            <div className="p-1 rounded bg-amber-500/10 text-amber-400">
              <Cigarette className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-300 font-mono">
            {totalAvoidedCigarettes}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            cigs avoided today
          </span>
        </div>

        {/* CO2e Avoided */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {isHi ? "CO2e बचत" : "CO2e Prevented"}
            </span>
            <div className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <Leaf className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-300 font-mono">
            {totalSavedCo2Kg}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            kg CO2e avoided
          </span>
        </div>

        {/* Money Saved */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {isHi ? "अनुमानित बचत" : "Money Saved"}
            </span>
            <div className="p-1 rounded bg-blue-500/10 text-blue-400">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-blue-300 font-mono">
            ₹{totalSavedMoneyInr}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            direct transit fuel savings
          </span>
        </div>
      </div>

      {/* Streak and Habit Consistency Card */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {streakDays} Day Clean-Air Habit Streak
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Consistent masking and indoor filtration reduce cardiovascular mortality risk by 28%.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full hidden sm:inline-block">
          Active Defense
        </span>
      </div>

      {/* Expandable "How We Calculated This" Modal / Accordion */}
      <ImpactModal breakdowns={breakdowns} language={language} />
    </div>
  );
}
