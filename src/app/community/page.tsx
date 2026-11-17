"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { DEMO_COMMUNITY_GROUP } from "@/lib/data-store";
import { PosterGenerator } from "@/components/poster-generator";
import { 
  Users, 
  Trophy, 
  Leaf, 
  TrendingDown, 
  Flame, 
  CheckCircle2, 
  Share2 
} from "lucide-react";
import { getTranslation } from "@/lib/i18n";

export default function CommunityPage() {
  const { aqiData, language } = useApp();
  const isHi = language === "hi";
  const t = getTranslation(language);
  const community = DEMO_COMMUNITY_GROUP;
  const challenge = community.currentChallenge;

  const progressPercent = Math.min(100, Math.round((challenge.completedActions / challenge.targetActions) * 100));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
          {isHi ? "सामुदायिक सशक्तिकरण" : "Community & RWA Action"}
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
          {t.community.title}
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-lg">
          {t.community.subtitle}
        </p>
      </div>

      {/* Active Challenge Card */}
      <div className="bg-gradient-to-br from-slate-900 via-surface-card to-emerald-950/40 border border-emerald-800/40 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
              {challenge.daysLeft} {isHi ? "दिन शेष" : "Days Remaining"}
            </span>
            <h2 className="text-base font-bold text-white mt-1.5">
              {challenge.title}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {challenge.description}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xl font-extrabold text-emerald-300 font-mono">
              {progressPercent}%
            </span>
            <span className="text-[10px] text-slate-400 block">completed</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">CO2e Avoided</span>
            <span className="text-sm font-bold text-emerald-300 font-mono">
              {challenge.co2AvoidedKg} kg
            </span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Toxic PM Avoided</span>
            <span className="text-sm font-bold text-cyan-300 font-mono">
              {(challenge.pmAvoidedGrams / 1000).toFixed(1)} kg
            </span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Actions Taken</span>
            <span className="text-sm font-bold text-white font-mono">
              {challenge.completedActions} / {challenge.targetActions}
            </span>
          </div>
        </div>
      </div>

      {/* WhatsApp Shareable Poster Generator */}
      <PosterGenerator aqiData={aqiData} community={community} language={language} />

      {/* Leaderboard Card */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            {t.community.leaderboard}
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            {community.memberCount} members active
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-3">
          {isHi
            ? "गोपनीयता-सुरक्षित उपनाम (Anonymous handles) के साथ सक्रिय पड़ोसियों की रैंकिंग।"
            : "Privacy-preserving anonymous handles celebrating community leaders taking daily clean-air action."}
        </p>

        <div className="space-y-2">
          {community.leaderboard.map((item) => (
            <div
              key={item.rank}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono text-[11px] ${
                  item.rank === 1 ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" :
                  item.rank === 2 ? "bg-slate-300/20 text-slate-200 border border-slate-400/40" :
                  item.rank === 3 ? "bg-amber-700/20 text-amber-500 border border-amber-700/40" :
                  "bg-slate-800 text-slate-400"
                }`}>
                  {item.rank}
                </div>
                <span className="font-semibold text-white">{item.name}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-slate-400 font-mono text-[11px]">
                  {item.actionsDone} actions
                </span>
                <span className="text-cyan-300 font-bold font-mono">
                  {item.score} pts
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
