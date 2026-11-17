"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, AQIData, AppLanguage, PlanActionBlock } from "@/types";
import { DEFAULT_USER_PROFILE, DEMO_PERSONAS } from "@/lib/personas";
import { FALLBACK_AQI_DATA, fetchLiveAQI } from "@/lib/aqi-service";

interface AppContextType {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  selectPersona: (personaKey: string) => void;
  aqiData: AQIData;
  refreshAQI: () => Promise<void>;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  completedActions: Record<string, boolean>;
  toggleActionCompleted: (actionId: string, block?: PlanActionBlock) => void;
  totalSavedPm25Ug: number;
  totalAvoidedCigarettes: number;
  totalSavedCo2Kg: number;
  totalSavedMoneyInr: number;
  streakDays: number;
  indoorSensorReading: number | null;
  setIndoorSensorReading: (val: number | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [aqiData, setAqiData] = useState<AQIData>(FALLBACK_AQI_DATA);
  const [language, setLanguageState] = useState<AppLanguage>("en");
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});
  const [totalSavedPm25Ug, setTotalSavedPm25Ug] = useState<number>(710);
  const [totalAvoidedCigarettes, setTotalAvoidedCigarettes] = useState<number>(2.2);
  const [totalSavedCo2Kg, setTotalSavedCo2Kg] = useState<number>(1.8);
  const [totalSavedMoneyInr, setTotalSavedMoneyInr] = useState<number>(45);
  const [streakDays, setStreakDays] = useState<number>(4);
  const [indoorSensorReading, setIndoorSensorReading] = useState<number | null>(null);

  // Initialize from LocalStorage or live fetch
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("smogshield_profile");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfileState(parsed);
        setLanguageState(parsed.language || "en");
      }

      const savedActions = localStorage.getItem("smogshield_actions");
      if (savedActions) {
        setCompletedActions(JSON.parse(savedActions));
      }

      const savedLang = localStorage.getItem("smogshield_lang");
      if (savedLang === "en" || savedLang === "hi") {
        setLanguageState(savedLang);
      }
    } catch (e) {
      console.warn("Storage init note:", e);
    }

    // Initial AQI fetch
    refreshAQI();
  }, []);

  const refreshAQI = async () => {
    try {
      const live = await fetchLiveAQI(profile.latitude, profile.longitude);
      setAqiData(live);
    } catch {
      setAqiData(FALLBACK_AQI_DATA);
    }
  };

  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
    try {
      localStorage.setItem("smogshield_profile", JSON.stringify(newProfile));
    } catch {}
    refreshAQI();
  };

  const selectPersona = (personaKey: string) => {
    const p = DEMO_PERSONAS[personaKey];
    if (p) {
      setProfile(p);
      setLanguageState(p.language);
      try {
        localStorage.setItem("smogshield_profile", JSON.stringify(p));
        localStorage.setItem("smogshield_lang", p.language);
      } catch {}
    }
  };

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    setProfileState(prev => ({ ...prev, language: lang }));
    try {
      localStorage.setItem("smogshield_lang", lang);
    } catch {}
  };

  const toggleActionCompleted = (actionId: string, block?: PlanActionBlock) => {
    setCompletedActions(prev => {
      const next = { ...prev, [actionId]: !prev[actionId] };
      const isNowDone = next[actionId];

      if (block) {
        const multiplier = isNowDone ? 1 : -1;
        setTotalSavedPm25Ug(v => Math.max(0, v + (block.impact.pm25AvoidedUg * multiplier)));
        setTotalAvoidedCigarettes(v => Number(Math.max(0, v + (block.impact.cigarettesAvoided * multiplier)).toFixed(1)));
        setTotalSavedCo2Kg(v => Number(Math.max(0, v + (block.impact.co2eSavedKg * multiplier)).toFixed(1)));
        setTotalSavedMoneyInr(v => Math.max(0, v + (block.impact.moneySavedInr * multiplier)));
      }

      try {
        localStorage.setItem("smogshield_actions", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        selectPersona,
        aqiData,
        refreshAQI,
        language,
        setLanguage,
        completedActions,
        toggleActionCompleted,
        totalSavedPm25Ug,
        totalAvoidedCigarettes,
        totalSavedCo2Kg,
        totalSavedMoneyInr,
        streakDays,
        indoorSensorReading,
        setIndoorSensorReading
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
