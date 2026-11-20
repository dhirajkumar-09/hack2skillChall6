"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { DEMO_PERSONAS } from "@/lib/personas";
import { Sparkles, CheckCircle2, Users, Bike, HeartPulse, MapPin } from "lucide-react";

export function PersonaSwitcher() {
  const { profile, selectPersona, language } = useApp();
  const isHi = language === "hi";

  const personas = [
    {
      key: "family_toddler",
      label: isHi ? "शर्मा परिवार" : "Sharma Family",
      sub: isHi ? "3 वर्षीय बच्चा + अस्थमा पीड़ित दादाजी" : "Toddler + Asthmatic Grandfather",
      location: "New Delhi",
      membersCount: isHi ? "4 सदस्य" : "4 Members",
      badge: isHi ? "उच्च संवेदनशीलता" : "High Sensitivity",
      badgeStyle: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      icon: Users,
      accentColor: "from-cyan-500/20 to-emerald-500/10",
      iconBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
    },
    {
      key: "commuter_twowheeler",
      label: isHi ? "कबीर (दुपहिया यात्री)" : "Kabir (Commuter)",
      sub: isHi ? "दैनिक 50 मिनट बाइक यात्रा" : "Daily 50min Bike Commuter",
      location: "East Delhi",
      membersCount: isHi ? "2 सदस्य" : "2 Members",
      badge: isHi ? "उच्च सड़क संपर्क" : "High Exposure",
      badgeStyle: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      icon: Bike,
      accentColor: "from-amber-500/20 to-orange-500/10",
      iconBg: "bg-amber-500/10 border-amber-500/30 text-amber-400"
    },
    {
      key: "elderly_frugal",
      label: isHi ? "सरस्वती व जगदीश (बुजुर्ग दंपति)" : "Elderly Couple (Seniors)",
      sub: isHi ? "पेंशनभोगी दंपति (सीओपीडी व हृदय रोग, कानपुर)" : "Retired Pensioners (COPD & Heart, Kanpur)",
      location: "Kanpur",
      membersCount: isHi ? "2 बुजुर्ग" : "2 Seniors",
      badge: isHi ? "अति संवेदनशील व सीमित बजट" : "Severe Vulnerability",
      badgeStyle: "bg-rose-500/15 text-rose-300 border-rose-500/30",
      icon: HeartPulse,
      accentColor: "from-rose-500/20 to-purple-500/10",
      iconBg: "bg-rose-500/10 border-rose-500/30 text-rose-400"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-surface-card via-slate-900/90 to-surface-card border border-surface-border rounded-2xl p-4 sm:p-5 shadow-2xl mb-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              {isHi ? "पारिवारिक परिदृश्य स्विच करें (Household Personas)" : "Switch Household Scenario"}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isHi ? "1-क्लिक में विभिन्न जीवनशैली, उम्र और स्वास्थ्य संवेदनशीलता देखें" : "Test real-time personalization for diverse lifestyles & sensitivities"}
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 px-3 py-1 rounded-full font-semibold font-mono shadow-sm">
          {isHi ? "3 प्रमाणित प्रोफाइल" : "3 Verified Lifestyles"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {personas.map((p) => {
          const isSelected = profile.id === DEMO_PERSONAS[p.key]?.id;
          const Icon = p.icon;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => selectPersona(p.key)}
              className={`relative p-3.5 rounded-xl text-left border transition-all duration-200 group overflow-hidden ${
                isSelected
                  ? `bg-gradient-to-br ${p.accentColor} border-cyan-400 shadow-xl shadow-cyan-950/50 ring-2 ring-cyan-400/40`
                  : "bg-slate-900/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900 hover:-translate-y-0.5"
              }`}
            >
              {/* Header row: Icon, Label & Active Indicator */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl border ${p.iconBg} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-bold transition ${isSelected ? "text-white" : "text-slate-200 group-hover:text-white"}`}>
                      {p.label}
                    </h4>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-cyan-400" />
                      {p.location} · {p.membersCount}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-300 bg-cyan-950 border border-cyan-700/60 px-2 py-0.5 rounded-full shadow-sm shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>{isHi ? "सक्रिय" : "Active"}</span>
                  </span>
                )}
              </div>

              {/* Sub description */}
              <p className="text-[11px] text-slate-300 line-clamp-1 mb-2.5 pl-0.5">
                {p.sub}
              </p>

              {/* Bottom pill tags */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/70">
                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${p.badgeStyle}`}>
                  {p.badge}
                </span>
                <span className="text-[10px] text-slate-400 font-mono group-hover:text-cyan-400 transition">
                  {isHi ? "क्लिक करें →" : "Select →"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
