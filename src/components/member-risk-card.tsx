"use client";

import React from "react";
import { UserProfile, AQIData } from "@/types";
import { calculateMemberRisk } from "@/lib/impact-engine";
import { HeartPulse, Baby, User, ShieldAlert, Sparkles, Cigarette, AlertCircle } from "lucide-react";

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

  const formatSensitivity = (s: string) => {
    switch (s) {
      case "copd":
        return isHi ? "सीओपीडी (COPD)" : "COPD";
      case "heart_condition":
        return isHi ? "हृदय रोग" : "Heart Condition";
      case "asthma":
        return isHi ? "दमा / अस्थमा" : "Asthma";
      case "allergies":
        return isHi ? "धूल / पराग एलर्जी" : "Allergies";
      case "pregnancy":
        return isHi ? "गर्भावस्था" : "Pregnancy";
      case "none":
        return isHi ? "सामान्य" : "General";
      default:
        return s;
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "Critical":
        return {
          label: isHi ? "अत्यंत गंभीर जोखिम" : "Critical Risk",
          style: "bg-rose-950/80 text-rose-300 border-rose-600/70"
        };
      case "Severe":
        return {
          label: isHi ? "गंभीर जोखिम" : "Severe Risk",
          style: "bg-purple-950/80 text-purple-300 border-purple-600/70"
        };
      case "High":
        return {
          label: isHi ? "उच्च जोखिम" : "High Risk",
          style: "bg-orange-950/80 text-orange-300 border-orange-600/70"
        };
      case "Moderate":
        return {
          label: isHi ? "मध्यम जोखिम" : "Moderate Risk",
          style: "bg-amber-950/80 text-amber-300 border-amber-600/70"
        };
      default:
        return {
          label: isHi ? "सामान्य स्थिति" : "Low Risk",
          style: "bg-emerald-950/80 text-emerald-300 border-emerald-600/70"
        };
    }
  };

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          {isHi ? "परिवार के सदस्यों का स्वास्थ्य जोखिम" : "Household Vulnerability Breakdown"}
        </h3>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full">
          {profile.members.length} {isHi ? "सदस्य" : "members"}
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        {isHi
          ? "उम्र, श्वसन दर (Breathing Rate) और व्यक्तिगत फेफड़ों व हृदय संवेदनशीलता के आधार पर वास्तविक अनुमान।"
          : "Personalized inhalation exposure and sensitivity factors calculated deterministically from age, breathing rate, and health profiles."}
      </p>

      <div className="space-y-3">
        {profile.members.map((member) => {
          // Assume indoor PM2.5 is ~25% of outdoor if has purifier, or ~65% if unpurified
          const indoorEstimate = profile.hasAirPurifier ? aqiData.pm25 * 0.25 : aqiData.pm25 * 0.65;
          const assessment = calculateMemberRisk(member, aqiData.pm25, indoorEstimate);
          const badge = getRiskBadge(assessment.riskLevel);

          return (
            <div
              key={member.id}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 shrink-0">
                    {getRoleIcon(member.role)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {member.name}
                    </h4>
                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                      <span className="text-[11px] text-slate-300 font-medium">
                        {isHi ? `आयु: ${member.age} वर्ष` : `Age ${member.age}`}
                      </span>
                      <span className="text-slate-600">•</span>
                      <div className="flex items-center gap-1 flex-wrap">
                        {member.sensitivities.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono border border-slate-700/60"
                          >
                            {formatSensitivity(s)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm shrink-0 ${badge.style}`}>
                  {badge.label}
                </span>
              </div>

              {/* Inhalation numbers */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/70 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/40 px-2.5 py-1.5 rounded-lg border border-slate-800/50">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">
                    {isHi ? "दैनिक अंतःश्वसन: " : "Est. Inhaled: "}
                    <strong className="text-white font-mono">{assessment.inhalationBaselineUg}</strong> µg
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/40 px-2.5 py-1.5 rounded-lg border border-slate-800/50">
                  <Cigarette className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">
                    ~<strong className="text-amber-300 font-mono">{assessment.cigaretteEquivDay}</strong> {isHi ? "सिगरेट धुआं" : "cigs equiv"}
                  </span>
                </div>
              </div>

              {/* Clinical / Actionable Guidance Warning */}
              <div className="mt-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-start gap-2 text-[11px] text-slate-300">
                <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {assessment.keyWarning}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
