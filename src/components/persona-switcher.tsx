"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { DEMO_PERSONAS } from "@/lib/personas";
import { UserCheck, Sparkles } from "lucide-react";

export function PersonaSwitcher() {
  const { profile, selectPersona, language } = useApp();
  const isHi = language === "hi";

  const personas = [
    {
      key: "family_toddler",
      label: isHi ? "शर्मा परिवार" : "Sharma Family",
      sub: isHi ? "3 वर्षीय बच्चा + अस्थमा पीड़ित दादाजी" : "Toddler + Asthmatic Grandparent",
      tag: "High Sensitivity"
    },
    {
      key: "commuter_twowheeler",
      label: isHi ? "कबीर (दुपहिया यात्री)" : "Kabir (Commuter)",
      sub: isHi ? "दैनिक 50 मिनट बाइक यात्रा" : "Daily Two-Wheeler 50min Commute",
      tag: "High Exposure"
    },
    {
      key: "elderly_frugal",
      label: isHi ? "सरस्वती व जगदीश" : "Elderly Couple",
      sub: isHi ? "पेंशनभोगी दंपति (कम बजट, कानपुर)" : "Retired Seniors (Frugal Budget)",
      tag: "Vulnerable & Frugal"
    }
  ];

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-4 shadow-lg mb-6">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          {isHi ? "1-क्लिक टेस्ट व्यक्ति (Persona) चुनें" : "Quick Persona Switcher (Instant Demo)"}
        </span>
        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
          Demo Testing
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {personas.map((p) => {
          const isSelected = profile.id === DEMO_PERSONAS[p.key]?.id;
          return (
            <button
              key={p.key}
              onClick={() => selectPersona(p.key)}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                isSelected
                  ? "bg-cyan-950/60 border-cyan-500/60 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/40"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold ${isSelected ? "text-cyan-300" : "text-white"}`}>
                  {p.label}
                </span>
                {isSelected && <UserCheck className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">{p.sub}</p>
              <span className="text-[9px] text-cyan-400/80 font-mono block mt-1">
                {p.tag}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
