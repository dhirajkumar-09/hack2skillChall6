"use client";

import React from "react";
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
  Globe2
} from "lucide-react";
import { useApp } from "@/context/app-context";
import { getTranslation } from "@/lib/i18n";

export function NavBar() {
  const pathname = usePathname();
  const { profile, aqiData, refreshAQI, language, setLanguage } = useApp();
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
