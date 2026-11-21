"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, AQIData, AppLanguage, PlanActionBlock, AQIStandard } from "@/types";
import { DEFAULT_USER_PROFILE, DEMO_PERSONAS } from "@/lib/personas";
import { FALLBACK_AQI_DATA, fetchLiveAQI, calibrateAQIData } from "@/lib/aqi-service";
import { logger } from "@/lib/logger";

interface AppContextType {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  selectPersona: (personaKey: string) => void;
  aqiData: AQIData;
  refreshAQI: (targetLat?: number, targetLon?: number) => Promise<void>;
  aqiStandard: AQIStandard;
  setAqiStandard: (std: AQIStandard) => void;
  manualPm25: number | null;
  calibrateSensor: (pm25: number | null, note?: string) => void;
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
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [aqiData, setAqiData] = useState<AQIData>(FALLBACK_AQI_DATA);
  const [aqiStandard, setAqiStandardState] = useState<AQIStandard>("cpcb");
  const [manualPm25, setManualPm25] = useState<number | null>(null);
  const [language, setLanguageState] = useState<AppLanguage>("en");
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});
  const [totalSavedPm25Ug, setTotalSavedPm25Ug] = useState<number>(710);
  const [totalAvoidedCigarettes, setTotalAvoidedCigarettes] = useState<number>(2.2);
  const [totalSavedCo2Kg, setTotalSavedCo2Kg] = useState<number>(1.8);
  const [totalSavedMoneyInr, setTotalSavedMoneyInr] = useState<number>(45);
  const [streakDays, setStreakDays] = useState<number>(4);
  const [indoorSensorReading, setIndoorSensorReading] = useState<number | null>(null);
  const DEFAULT_GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  const [geminiApiKey, setGeminiApiKeyState] = useState<string>(DEFAULT_GEMINI_KEY);

  // Initialize from LocalStorage or live fetch
  useEffect(() => {
    let initialLat = DEFAULT_USER_PROFILE.latitude;
    let initialLon = DEFAULT_USER_PROFILE.longitude;
    let initialStd: AQIStandard = "cpcb";
    let initialManualPm: number | null = null;

    try {
      const savedKey = localStorage.getItem("smogshield_gemini_key");
      if (savedKey) {
        setGeminiApiKeyState(savedKey);
      } else {
        setGeminiApiKeyState(DEFAULT_GEMINI_KEY);
        try { localStorage.setItem("smogshield_gemini_key", DEFAULT_GEMINI_KEY); } catch {}
      }

      const savedStd = localStorage.getItem("smogshield_aqi_standard") as AQIStandard;
      if (savedStd === "cpcb" || savedStd === "epa") {
        initialStd = savedStd;
        setAqiStandardState(savedStd);
      }

      const savedManual = localStorage.getItem("smogshield_manual_pm25");
      if (savedManual) {
        const val = parseFloat(savedManual);
        if (!isNaN(val)) {
          initialManualPm = val;
          setManualPm25(val);
        }
      }

      const savedProfile = localStorage.getItem("smogshield_profile");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfileState(parsed);
        setLanguageState(parsed.language || "en");
        initialLat = parsed.latitude;
        initialLon = parsed.longitude;
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
      logger.warn("Storage init note:", e);
    }

    // Initial AQI fetch with initial parameters
    refreshAQI(initialLat, initialLon, initialStd, initialManualPm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshAQI = async (
    targetLat?: number, 
    targetLon?: number, 
    forcedStd?: AQIStandard,
    forcedManualPm?: number | null
  ) => {
    const lat = targetLat !== undefined ? targetLat : profile.latitude;
    const lon = targetLon !== undefined ? targetLon : profile.longitude;
    const std = forcedStd !== undefined ? forcedStd : aqiStandard;
    const currentManual = forcedManualPm !== undefined ? forcedManualPm : manualPm25;

    let fetched: AQIData | null = null;
    try {
      const res = await fetch(`/api/aqi?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        fetched = await res.json();
      }
    } catch (e) {
      logger.warn("Server API fetch error, fallback to direct fetch:", e);
    }

    if (!fetched) {
      try {
        fetched = await fetchLiveAQI(lat, lon);
      } catch {
        fetched = { ...FALLBACK_AQI_DATA };
      }
    }

    if (currentManual !== null && fetched) {
      const calibrated = calibrateAQIData(fetched, currentManual, std);
      setAqiData(calibrated);
    } else if (fetched) {
      const selectedAqi = std === "epa" ? (fetched.epaAqi ?? fetched.aqi) : (fetched.cpcbAqi ?? fetched.aqi);
      const updatedForecast = (fetched.forecastHourly || []).map(f => ({
        ...f,
        aqi: std === "epa" ? (f.epaAqi ?? f.aqi) : (f.cpcbAqi ?? f.aqi)
      }));
      setAqiData({
        ...fetched,
        aqi: selectedAqi,
        forecastHourly: updatedForecast
      });
    }
  };

  const setAqiStandard = (std: AQIStandard) => {
    setAqiStandardState(std);
    try {
      localStorage.setItem("smogshield_aqi_standard", std);
    } catch {}
    setAqiData(prev => {
      const newAqi = std === "epa" ? (prev.epaAqi ?? prev.aqi) : (prev.cpcbAqi ?? prev.aqi);
      const updatedForecast = (prev.forecastHourly || []).map(f => ({
        ...f,
        aqi: std === "epa" ? (f.epaAqi ?? f.aqi) : (f.cpcbAqi ?? f.aqi)
      }));
      return {
        ...prev,
        aqi: newAqi,
        forecastHourly: updatedForecast
      };
    });
  };

  const calibrateSensor = (pm25: number | null, note?: string) => {
    setManualPm25(pm25);
    try {
      if (pm25 !== null) {
        localStorage.setItem("smogshield_manual_pm25", String(pm25));
      } else {
        localStorage.removeItem("smogshield_manual_pm25");
      }
    } catch {}

    if (pm25 !== null) {
      setAqiData(prev => calibrateAQIData(prev, pm25, aqiStandard, note || "Calibrated to handheld / mobile app sensor"));
    } else {
      refreshAQI(profile.latitude, profile.longitude, aqiStandard, null);
    }
  };

  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
    try {
      localStorage.setItem("smogshield_profile", JSON.stringify(newProfile));
    } catch {}
    refreshAQI(newProfile.latitude, newProfile.longitude);
  };

  const selectPersona = (personaKey: string) => {
    const p = DEMO_PERSONAS[personaKey];
    if (p) {
      // Retain the user's active UI language preference
      const updatedProfile = { ...p, language };
      setProfile(updatedProfile);
      try {
        localStorage.setItem("smogshield_profile", JSON.stringify(updatedProfile));
      } catch {}
    }
  };

  const setGeminiApiKey = (key: string) => {
    setGeminiApiKeyState(key);
    try {
      if (key) {
        localStorage.setItem("smogshield_gemini_key", key);
      } else {
        localStorage.removeItem("smogshield_gemini_key");
      }
    } catch {}
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
        aqiStandard,
        setAqiStandard,
        manualPm25,
        calibrateSensor,
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
        setIndoorSensorReading,
        geminiApiKey,
        setGeminiApiKey
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
