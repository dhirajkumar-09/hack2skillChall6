"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/app-context";
import { PersonaSwitcher } from "@/components/persona-switcher";
import { AqiGauge } from "@/components/aqi-gauge";
import { MemberRiskCard } from "@/components/member-risk-card";
import { LocationSelector, POPULAR_CITIES } from "@/components/location-selector";
import { 
  CalendarClock, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Home, 
  MessageSquareQuote,
  Flame,
  Cigarette,
  Leaf,
  MapPin,
  ChevronDown
} from "lucide-react";
import { getTranslation } from "@/lib/i18n";

export default function DashboardPage() {
  const { 
    profile, 
    setProfile,
    aqiData, 
    language, 
    completedActions, 
    toggleActionCompleted,
    totalSavedPm25Ug,
    totalAvoidedCigarettes,
    totalSavedCo2Kg,
    streakDays
  } = useApp();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const t = getTranslation(language);
  const isHi = language === "hi";

  // Daily habit checklist
  const habits = [
    {
      id: "habit_mask",
      title: isHi ? "बाहर निकलते समय N95 मास्क पहना" : "Wore sealed N95 respirator outdoors",
      sub: isHi ? "सड़क के सीधे धुएं से फेफड़ों का बचाव" : "Blocks direct road-level exhaust",
      pmAvoided: 350,
      cigsAvoided: 1.1,
      co2Saved: 0,
      moneySaved: 0
    },
    {
      id: "habit_windows",
      title: isHi ? "सुबह के समय खिड़कियां बंद रखीं" : "Kept windows shut during morning inversion",
      sub: isHi ? "सुबह के जमे हुए धुएं को घर में आने से रोका" : "Prevented early smog intrusion",
      pmAvoided: 220,
      cigsAvoided: 0.7,
      co2Saved: 0,
      moneySaved: 0
    },
    {
      id: "habit_wet_mop",
      title: isHi ? "झाड़ू की जगह गीला पोछा लगाया" : "Damp wet-mopped floors (no dry sweeping)",
      sub: isHi ? "महीन धूल को दोबारा हवा में उड़ने से रोका" : "Trapped micro-dust without resuspension",
      pmAvoided: 140,
      cigsAvoided: 0.4,
      co2Saved: 0,
      moneySaved: 0
    },
    {
      id: "habit_metro",
      title: isHi ? "निजी वाहन की जगह मेट्रो / बस का प्रयोग किया" : "Swapped solo vehicle for Metro / Transit",
      sub: isHi ? "कार्बन उत्सर्जन व सड़क पर अत्यधिक प्रदूषण से बचाव" : "Cut road-tunnel exhaust inhalation & emissions",
      pmAvoided: 400,
      cigsAvoided: 1.2,
      co2Saved: 1.8,
      moneySaved: 45
    }
  ];

  return (
    <div className="space-y-6">
      {/* Persona Quick Switcher */}
      <PersonaSwitcher />

      {/* Location Quick Bar & Selector */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-3.5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {isHi ? "सक्रिय स्टेशन (Station)" : "Monitoring Location"}
              </span>
              <span className="text-[9px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.5 rounded">
                {profile.latitude}°N, {profile.longitude}°E
              </span>
            </div>
            <h3 className="text-sm font-bold text-white truncate max-w-xs">
              {profile.locationName}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setShowLocationModal(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 shadow-md shadow-cyan-950 transition"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{isHi ? "शहर बदलें" : "Change Location"}</span>
            <ChevronDown className="w-3 h-3 opacity-80" />
          </button>

          {/* Quick city pill shortcuts */}
          {POPULAR_CITIES.slice(0, 6).map((city, idx) => {
            const isCurrent = Math.abs(city.lat - profile.latitude) < 0.05 && Math.abs(city.lon - profile.longitude) < 0.05;
            return (
              <button
                key={idx}
                onClick={() => setProfile({
                  ...profile,
                  locationName: city.name,
                  latitude: city.lat,
                  longitude: city.lon
                })}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium border shrink-0 transition ${
                  isCurrent
                    ? "bg-cyan-950/80 border-cyan-400 text-cyan-300 font-bold"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400"
                }`}
              >
                {city.name.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      <LocationSelector
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />

      {/* Main AQI Gauge Card */}
      <AqiGauge data={aqiData} language={language} />

      {/* Live Impact Mini-Banner */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-emerald-950/80 border border-cyan-800/50 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {isHi ? "आपकी आज की सुरक्षा उपलब्धि" : "Your Active Exposure Reduction Today"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 font-mono text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{streakDays} Day Streak</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-2">
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">{isHi ? "बचाया गया PM2.5" : "PM2.5 Avoided"}</span>
            <span className="text-base font-extrabold text-cyan-300 font-mono">
              {totalSavedPm25Ug} µg
            </span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">{isHi ? "सिगरेट समतुल्य" : "Cigs Equiv Avoided"}</span>
            <span className="text-base font-extrabold text-amber-300 font-mono flex items-center justify-center gap-1">
              <Cigarette className="w-3.5 h-3.5" />
              {totalAvoidedCigarettes}
            </span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">{isHi ? "रोकी गई CO2" : "CO2e Avoided"}</span>
            <span className="text-base font-extrabold text-emerald-300 font-mono flex items-center justify-center gap-1">
              <Leaf className="w-3.5 h-3.5" />
              {totalSavedCo2Kg} kg
            </span>
          </div>
        </div>

        <div className="mt-3 text-right">
          <Link
            href="/impact"
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1"
          >
            {isHi ? "पूरी गणना व सूत्र देखें" : "View formula breakdown & citations"}
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Daily Habits Check-in */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              {isHi ? "आज के स्वच्छ-वायु कदम (दैनिक चेक-इन)" : "Today's Clean-Air Action Check-In"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isHi ? "किए गए कदमों पर टिक करें — प्रभाव तुरंत अपडेट होगा" : "Tap actions you took today to live-update your health protection metrics"}
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {habits.map((h) => {
            const isDone = !!completedActions[h.id];
            return (
              <button
                key={h.id}
                onClick={() => toggleActionCompleted(h.id, {
                  id: h.id,
                  title: h.title,
                  timeRange: "Today",
                  period: "morning",
                  action: h.title,
                  why: h.sub,
                  impact: {
                    pm25AvoidedUg: h.pmAvoided,
                    cigarettesAvoided: h.cigsAvoided,
                    co2eSavedKg: h.co2Saved,
                    moneySavedInr: h.moneySaved
                  }
                })}
                className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  isDone
                    ? "bg-emerald-950/30 border-emerald-500/50 text-white"
                    : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${isDone ? "line-through text-slate-400" : "text-white"}`}>
                      {h.title}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono font-medium shrink-0 ml-2">
                      +{h.pmAvoided} µg saved
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{h.sub}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Member Risk Breakdown */}
      <MemberRiskCard profile={profile} aqiData={aqiData} language={language} />

      {/* Today's Clean Air Plan Callout */}
      <div className="bg-gradient-to-r from-slate-900 to-[#121c2e] border border-cyan-800/40 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
            {isHi ? "AI व्यक्तिगत दिनचर्या" : "GenAI Personalized Routine"}
          </span>
          <h3 className="text-base font-bold text-white mt-1.5">
            {isHi ? "आज की स्वच्छ-वायु समय-सारिणी तैयार है" : "Today's Clean-Air Plan is Active"}
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-md">
            {isHi
              ? "वर्तमान AQI, तापमान व्युत्क्रमण और आपके परिवार की संवेदनशीलता के आधार पर समय-बद्ध कार्य योजना।"
              : "Structured schedule covering morning sealing, commute protection, afternoon window flush, and clean sleep."}
          </p>
        </div>
        <Link
          href="/plan"
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shrink-0 shadow-lg shadow-cyan-950"
        >
          <CalendarClock className="w-4 h-4" />
          {isHi ? "पूरी योजना देखें" : "View Full Plan"}
        </Link>
      </div>

      {/* Quick Explore Row */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/indoor"
          className="p-4 rounded-2xl bg-surface-card border border-surface-border hover:border-slate-700 transition flex flex-col justify-between"
        >
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-2">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">
              {isHi ? "घर की हवा और देसी प्यूरीफायर" : "Indoor Hub & DIY Purifier"}
            </h4>
            <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
              Corsi-Rosenthal Box · CADR ~260
            </span>
          </div>
        </Link>

        <Link
          href="/chat"
          className="p-4 rounded-2xl bg-surface-card border border-surface-border hover:border-slate-700 transition flex flex-col justify-between"
        >
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit mb-2">
            <MessageSquareQuote className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">
              {isHi ? "स्वच्छ-वायु AI सहायक" : "Grounded AI Chat"}
            </h4>
            <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
              Ask about kids, masks & windows
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
