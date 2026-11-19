"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldAlert, 
  CalendarClock, 
  Home, 
  ArrowLeftRight, 
  BarChart3, 
  MessageSquareQuote, 
  Users, 
  UserCircle2,
  RefreshCw,
  Globe2,
  KeyRound,
  X,
  Check,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { useApp } from "@/context/app-context";
import { getTranslation } from "@/lib/i18n";

export function NavBar() {
  const pathname = usePathname();
  const { profile, aqiData, refreshAQI, language, setLanguage, geminiApiKey, setGeminiApiKey } = useApp();
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(geminiApiKey);
  const [keySavedMessage, setKeySavedMessage] = useState(false);
  const t = getTranslation(language);

  const navItems = [
    { href: "/", label: t.nav.dashboard, icon: ShieldAlert },
    { href: "/plan", label: t.nav.plan, icon: CalendarClock },
    { href: "/indoor", label: t.nav.indoor, icon: Home },
    { href: "/swaps", label: t.nav.swaps, icon: ArrowLeftRight },
    { href: "/impact", label: t.nav.impact, icon: BarChart3 },
    { href: "/chat", label: t.nav.chat, icon: MessageSquareQuote },
    { href: "/community", label: t.nav.community, icon: Users },
    { href: "/profile", label: t.nav.profile, icon: UserCircle2 },
  ];

  const getAqiPillColor = (cat: string) => {
    switch (cat) {
      case "Good": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "Moderate": return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "Unhealthy for Sensitive Groups": return "bg-orange-500/20 text-orange-300 border-orange-500/40";
      case "Unhealthy": return "bg-red-500/20 text-red-300 border-red-500/40";
      case "Very Unhealthy": return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      default: return "bg-rose-950/40 text-rose-300 border-rose-500/50";
    }
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#090d16]/90 backdrop-blur-md border-b border-surface-border px-4 py-2.5 transition-colors">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="text-black font-extrabold text-sm tracking-tighter">SS</span>
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
                SmogShield
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold px-1.5 py-0.5 rounded-full">
                  PWA
                </span>
              </span>
              <p className="text-[11px] text-slate-400 line-clamp-1 max-w-[140px] sm:max-w-xs">
                {profile.locationName.split(",")[0]}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {/* Live AQI badge */}
            <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getAqiPillColor(aqiData.category)}`}>
              <span className="w-2 h-2 rounded-full animate-pulse bg-current" />
              <span>AQI {aqiData.aqi}</span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="px-2 py-1 text-xs font-medium rounded-md border border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 flex items-center gap-1 transition"
              title="Toggle Language (English / हिन्दी)"
            >
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === "en" ? "हिन्दी" : "EN"}</span>
            </button>

            {/* Gemini API Key Button */}
            <button
              onClick={() => {
                setTempKey(geminiApiKey);
                setShowKeyModal(true);
              }}
              className={`p-1.5 rounded-md border text-xs transition flex items-center gap-1 ${
                geminiApiKey
                  ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                  : "bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white"
              }`}
              title="Configure Gemini API Key"
            >
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              {geminiApiKey && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>

            {/* Refresh AQI */}
            <button
              onClick={() => refreshAQI()}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition"
              title="Refresh live air quality"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-card border border-surface-border rounded-2xl p-5 max-w-md w-full shadow-2xl relative space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-cyan-400" />
                  Google Gemini API Key
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Connect live Gemini 1.5 / 2.0 Flash models for real-time generative plans and chat.
                </p>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Status:</span>
                {geminiApiKey ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live Gemini Key Connected
                  </span>
                ) : (
                  <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Demo Mode Active (Zero Keys Required)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                SmogShield works fully in Demo Mode without any API keys. If you provide a Gemini API Key, it will query Google Gemini models live!
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Paste your Gemini API Key:
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400"
              />
              <div className="flex justify-between items-center mt-1.5 text-[11px]">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  Get free key at Google AI Studio <ExternalLink className="w-3 h-3" />
                </a>
                {geminiApiKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setGeminiApiKey("");
                      setTempKey("");
                      setKeySavedMessage(true);
                      setTimeout(() => setKeySavedMessage(false), 2000);
                    }}
                    className="text-rose-400 hover:underline"
                  >
                    Clear Key
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {keySavedMessage ? (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Saved!
                </span>
              ) : <span />}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGeminiApiKey(tempKey.trim());
                    setKeySavedMessage(true);
                    setTimeout(() => {
                      setKeySavedMessage(false);
                      setShowKeyModal(false);
                    }, 1200);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition"
                >
                  Save & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile / Tablet */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0c121e]/95 backdrop-blur-lg border-t border-surface-border safe-bottom">
        <div className="max-w-4xl mx-auto flex items-center justify-around px-1 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-[11px] font-medium transition-all ${
                  isActive
                    ? "text-cyan-400 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className={`relative p-1 rounded-lg transition-transform ${isActive ? "scale-110 bg-cyan-500/10" : ""}`}>
                  <Icon className={`w-5 h-5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                </div>
                <span className="truncate max-w-[58px] text-center mt-0.5">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
