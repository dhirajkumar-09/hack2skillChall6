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
  MapPin
} from "lucide-react";
import { useApp } from "@/context/app-context";
import { getTranslation } from "@/lib/i18n";
import { LocationSelector } from "@/components/location-selector";

export function NavBar() {
  const pathname = usePathname();
  const { profile, aqiData, refreshAQI, language, setLanguage } = useApp();
  const [showLocationModal, setShowLocationModal] = useState(false);
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
      <header className="sticky top-0 z-50 bg-[#090d16]/95 backdrop-blur-md border-b border-surface-border px-3 sm:px-6 lg:px-8 py-2.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & City */}
          <div className="flex items-center gap-2.5">
            <Link href="/" className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
              <span className="text-black font-extrabold text-sm tracking-tighter">SS</span>
            </Link>
            <div>
              <Link href="/" className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
                SmogShield
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold px-1.5 py-0.5 rounded-full">
                  PWA
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setShowLocationModal(true)}
                aria-label="Change current monitoring location"
                className="text-[11px] text-slate-400 hover:text-cyan-300 transition flex items-center gap-1 text-left line-clamp-1 max-w-[140px] sm:max-w-xs"
                title="Change Location & Live AQI"
              >
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">{profile.locationName.split("(")[0]}</span>
              </button>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions: Live AQI pill, Gemini AI Badge, Language toggle, Refresh */}
          <div className="flex items-center gap-2">
            {/* Gemini AI Status Badge */}
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-cyan-500/30 bg-cyan-950/40 text-cyan-300"
              title="Google Gemini AI Engine Active: Powering AI Plans, Chat & CAAQMS Grounding"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-semibold">✨ Gemini AI</span>
            </div>

            {/* Live AQI badge */}
            <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getAqiPillColor(aqiData.category)}`}>
              <span className="w-2 h-2 rounded-full animate-pulse bg-current" />
              <span>AQI {aqiData.aqi}</span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              aria-label={language === "en" ? "Switch language to Hindi" : "Switch language to English"}
              className="px-2.5 py-1 text-xs font-medium rounded-xl border border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 flex items-center gap-1 transition"
              title="Toggle Language (English / हिन्दी)"
            >
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
              <span>{language === "en" ? "हिन्दी" : "EN"}</span>
            </button>

            {/* Refresh AQI */}
            <button
              onClick={() => refreshAQI()}
              aria-label="Refresh live air quality data"
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 transition"
              title="Refresh live air quality"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Location Modal */}
      <LocationSelector
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />

      {/* Bottom Navigation for Mobile / Tablet */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0c121e]/95 backdrop-blur-lg border-t border-surface-border safe-bottom">
        <div className="max-w-7xl mx-auto flex items-center justify-around px-1 py-1">
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
