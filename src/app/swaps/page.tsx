"use client";

import React, { useState } from "react";
import { useApp } from "@/context/app-context";
import { SUSTAINABLE_SWAPS } from "@/lib/data-store";
import { 
  ArrowLeftRight, 
  Sparkles, 
  Check, 
  TrendingDown, 
  Leaf, 
  ShieldCheck, 
  DollarSign,
  Gauge
} from "lucide-react";
import { getTranslation } from "@/lib/i18n";

export default function SwapsPage() {
  const { profile, language } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const isHi = language === "hi";
  const t = getTranslation(language);

  const categories = [
    { key: "all", label: isHi ? "सभी विकल्प" : "All Swaps" },
    { key: "commute", label: isHi ? "यात्रा (Commute)" : "Commute" },
    { key: "heating", label: isHi ? "हीटिंग (Heating)" : "Heating" },
    { key: "cooking", label: isHi ? "रसोई (Cooking)" : "Cooking" },
    { key: "waste", label: isHi ? "अपशिष्ट (Waste)" : "Waste" },
  ];

  const filtered = selectedCategory === "all"
    ? SUSTAINABLE_SWAPS
    : SUSTAINABLE_SWAPS.filter(s => s.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
          {isHi ? "पर्यावरण व स्वास्थ्य विकल्प" : "Sustainable Alternatives Engine"}
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
          {t.swaps.title}
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-lg">
          {t.swaps.subtitle}
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setSelectedCategory(c.key)}
            className={`px-3 py-1.5 rounded-xl border shrink-0 transition ${
              selectedCategory === c.key
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Swaps Cards */}
      <div className="space-y-4">
        {filtered.map((swap) => (
          <div
            key={swap.id}
            className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-xl space-y-3"
          >
            {/* Header info */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                    {swap.category}
                  </span>
                  <span className="text-[10px] font-semibold text-cyan-400 flex items-center gap-1 font-mono">
                    <Gauge className="w-3 h-3" />
                    {swap.feasibilityScore}% Feasibility for You
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {swap.title}
                </h3>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-emerald-400 font-mono block">
                  {swap.costDifferenceInr}
                </span>
                <span className="text-[10px] text-slate-400 block">{swap.effort} Effort</span>
              </div>
            </div>

            {/* Before vs After Visual Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/30">
                <span className="text-[10px] text-rose-400 uppercase font-bold block mb-1">
                  🔴 Current High-Emission Baseline:
                </span>
                <span className="text-slate-300">{swap.fromAction}</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">
                  🟢 Recommended Clean Alternative:
                </span>
                <span className="text-white font-medium">{swap.toAction}</span>
              </div>
            </div>

            {/* Rationale & Health Benefit */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-1.5">
              <p className="text-slate-300">
                <strong className="text-white">{isHi ? "स्वास्थ्य लाभ: " : "Health Protection: "}</strong>
                {swap.healthBenefit}
              </p>
              <p className="text-slate-400 text-[11px]">
                <strong className="text-slate-300">{isHi ? "पर्यावरणीय तर्क: " : "Environmental Rationale: "}</strong>
                {swap.rationale}
              </p>
            </div>

            {/* Impact Metric Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-[11px]">
              <span className="bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
                <Leaf className="w-3 h-3" />
                -{swap.co2eMonthlyKg} kg CO2e / month
              </span>
              <span className="bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                -{swap.pmMonthlyGrams}g toxic PM / month
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
