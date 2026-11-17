"use client";

import React from "react";
import { UserProfile, AQIData } from "@/types";
import { calculateMemberRisk } from "@/lib/impact-engine";
import { HeartPulse, Baby, User, ShieldAlert, Sparkles, Cigarette } from "lucide-react";

interface MemberRiskCardProps {
  profile: UserProfile;
  aqiData: AQIData;
  language?: 'en' | 'hi';
}

export function MemberRiskCard({ profile, aqiData, language = 'en' }: MemberRiskCardProps) {
  const isHi = language === 'hi';

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "toddler":
      case "child":
        return <Baby className="w-4 h-4 text-pink-400" />;
      case "senior":
        return <HeartPulse className="w-4 h-4 text-amber-400" />;
      default:
        return <User className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "Critical":
        return "bg-rose-950/70 text-rose-300 border-rose-600/60";
      case "Severe":
        return "bg-purple-950/70 text-purple-300 border-purple-600/60";
      case "High":
        return "bg-orange-950/70 text-orange-300 border-orange-600/60";
      case "Moderate":
        return "bg-amber-950/70 text-amber-300 border-amber-600/60";
      default:
        return "bg-emerald-950/70 text-emerald-300 border-emerald-600/60";
    }
  };

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          {isHi ? "परिवार के सदस्यों का स्वास्थ्य जोखिम" : "Household Vulnerability Breakdown"}
        </h3>
        <span className="text-[11px] text-slate-400">
          {profile.members.length} {isHi ? "सदस्य" : "members"}
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-4">
        {isHi
          ? "उम्र, श्वसन दर और फेफड़ों की संवेदनशीलता के आधार पर व्यक्तिगत अनुमानित दैनिक जोखिम।"
          : "Personalized inhalation exposure and sensitivity factors calculated deterministically from age, breathing rate, and health profiles."}
      </p>

      <div className="space-y-3">
        {profile.members.map((member) => {
          // Assume indoor PM2.5 is ~40% of outdoor if has purifier, or ~70% if unpurified
          const indoorEstimate = profile.hasAirPurifier ? aqiData.pm25 * 0.25 : aqiData.pm25 * 0.65;
          const assessment = calculateMemberRisk(member, aqiData.pm25, indoorEstimate);

          return (
            <div
              key={member.id}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-800">
                    {getRoleIcon(member.role)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white leading-tight">
                      {member.name}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Age {member.age} · {member.sensitivities.join(", ")}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getRiskBadge(assessment.riskLevel)}`}>
                  {assessment.riskLevel} {isHi ? "जोखिम" : "Risk"}
                </span>
              </div>

              {/* Inhalation numbers */}
              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    Est. Inhaled: <strong className="text-white font-mono">{assessment.inhalationBaselineUg}</strong> µg/day
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Cigarette className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    ~<strong className="text-amber-300 font-mono">{assessment.cigaretteEquivDay}</strong> cigs equiv
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800/40">
                {assessment.keyWarning}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
