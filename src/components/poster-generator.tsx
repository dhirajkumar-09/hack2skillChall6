"use client";

import React, { useRef, useState } from "react";
import { AQIData, CommunityGroup } from "@/types";
import { Share2, Download, Copy, Check, Sparkles, MessageCircle } from "lucide-react";

interface PosterGeneratorProps {
  aqiData: AQIData;
  community: CommunityGroup;
  language?: 'en' | 'hi';
}

export function PosterGenerator({ aqiData, community, language = 'en' }: PosterGeneratorProps) {
  const isHi = language === 'hi';
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getWhatsAppText = () => {
    if (isHi) {
      return `🚨 *${community.name} - स्वच्छ वायु बुलेटिन* 🚨\n\n` +
        `📅 तारीख: ${new Date().toLocaleDateString('hi-IN')}\n` +
        `💨 *वर्तमान AQI:* ${aqiData.aqi} (${aqiData.category})\n` +
        `🔬 PM2.5: ${aqiData.pm25} µg/m³ (WHO मानक से ${Math.round(aqiData.pm25 / 15)}x अधिक)\n\n` +
        `🛑 *आज के 3 सामुदायिक सुरक्षा नियम:*\n` +
        `1. 🍂 *कूड़ा व सूखे पत्ते कतई न जलाएं* - कम्पोस्ट में डालें।\n` +
        `2. 😷 *बाहर निकलते ही N95 मास्क पहनें* - कपड़े का मास्क PM2.5 नहीं रोकता।\n` +
        `3. 🪟 *खिड़कियां केवल दोपहर 1:30 - 3:30 के बीच खोलें* - सुबह का धुआं खतरनाक है।\n\n` +
        `🌱 *हमारी सामूहिक उपलब्धि:*\n` +
        `• रोकी गई CO2: ${community.currentChallenge.co2AvoidedKg} kg\n` +
        `• रोकी गई PM धूल: ${(community.currentChallenge.pmAvoidedGrams / 1000).toFixed(1)} kg\n` +
        `• पूर्ण किए गए कदम: ${community.currentChallenge.completedActions} / ${community.currentChallenge.targetActions}\n\n` +
        `_स्मॉगशील्ड (SmogShield) द्वारा जनहित में जारी_`;
    }
    return `🚨 *${community.name} - Clean Air Action Bulletin* 🚨\n\n` +
      `📅 Date: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}\n` +
      `💨 *Current AQI:* ${aqiData.aqi} (${aqiData.category})\n` +
      `🔬 PM2.5: ${aqiData.pm25} µg/m³ (${Math.round(aqiData.pm25 / 15)}x WHO safety threshold)\n\n` +
      `🛡️ *3 Golden Community Protocols for Today:*\n` +
      `1. 🍂 *Zero Open Waste/Leaf Burning* - Report any smoke; mulch leaves instead.\n` +
      `2. 😷 *Wear Sealed N95/FFP2 Outdoors* - Cloth bandanas do not block PM2.5.\n` +
      `3. 🪟 *Ventilate Only Between 1:30 - 3:30 PM* - Avoid morning boundary inversion trap.\n\n` +
      `🌱 *Our Collective RWA Impact:*\n` +
      `• CO2e Avoided: ${community.currentChallenge.co2AvoidedKg} kg\n` +
      `• Toxic PM Blocked: ${(community.currentChallenge.pmAvoidedGrams / 1000).toFixed(1)} kg\n` +
      `• Community Actions: ${community.currentChallenge.completedActions} / ${community.currentChallenge.targetActions}\n\n` +
      `_Powered by SmogShield AI_`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getWhatsAppText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadPosterImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dimensions
    canvas.width = 600;
    canvas.height = 750;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 750);
    grad.addColorStop(0, "#090d16");
    grad.addColorStop(0.5, "#111827");
    grad.addColorStop(1, "#0f172a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 750);

    // Decorative top border
    const borderGrad = ctx.createLinearGradient(0, 0, 600, 0);
    borderGrad.addColorStop(0, "#0ea5e9");
    borderGrad.addColorStop(0.5, "#10b981");
    borderGrad.addColorStop(1, "#f59e0b");
    ctx.fillStyle = borderGrad;
    ctx.fillRect(0, 0, 600, 10);

    // Header badge
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(40, 35, 520, 65, 12);
    ctx.fill();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("SMOGSHIELD COMMUNITY ACTION", 60, 65);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px sans-serif";
    ctx.fillText(community.name, 60, 88);

    // AQI Big Alert Box
    const aqiColor = aqiData.aqi > 300 ? "#e11d48" : aqiData.aqi > 200 ? "#8b5cf6" : "#f97316";
    ctx.fillStyle = "#182235";
    ctx.strokeStyle = aqiColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(40, 120, 520, 140, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("CURRENT AIR QUALITY INDEX", 65, 155);

    ctx.fillStyle = aqiColor;
    ctx.font = "bold 56px monospace";
    ctx.fillText(`${aqiData.aqi}`, 65, 215);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(aqiData.category, 210, 190);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px sans-serif";
    ctx.fillText(`PM2.5: ${aqiData.pm25} µg/m³ · Best window: 1:30 - 3:30 PM`, 210, 215);

    // 3 Golden Rules
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("TODAY'S 3 COMMUNITY SAFETY PROTOCOLS", 40, 295);

    const rules = [
      { num: "1", title: "Zero Open Leaf / Waste Burning", desc: "Report all open fires to RWA desk. Compost dry leaves instead." },
      { num: "2", title: "Wear Sealed N95 Respirators", desc: "Cloth masks fail to stop PM2.5. Pinch nose bridge firmly." },
      { num: "3", title: "Ventilate Only 1:30 - 3:30 PM", desc: "Avoid morning boundary inversion. Keep rooms sealed early." }
    ];

    rules.forEach((r, idx) => {
      const y = 320 + (idx * 80);
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.roundRect(40, y, 520, 68, 12);
      ctx.fill();

      // Number badge
      ctx.fillStyle = "#0284c7";
      ctx.beginPath();
      ctx.arc(75, y + 34, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(r.num, 70, y + 40);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText(r.title, 110, y + 28);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "12px sans-serif";
      ctx.fillText(r.desc, 110, y + 50);
    });

    // Collective Impact Footer Box
    ctx.fillStyle = "#064e3b";
    ctx.strokeStyle = "#10b981";
    ctx.beginPath();
    ctx.roundRect(40, 580, 520, 105, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#a7f3d0";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("🌱 COMMUNITY COLLECTIVE IMPACT TO DATE", 65, 610);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px monospace";
    ctx.fillText(`${community.currentChallenge.co2AvoidedKg} kg`, 65, 645);
    ctx.fillStyle = "#6ee7b7";
    ctx.font = "12px sans-serif";
    ctx.fillText("CO2e Avoided", 65, 665);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px monospace";
    ctx.fillText(`${(community.currentChallenge.pmAvoidedGrams / 1000).toFixed(1)} kg`, 245, 645);
    ctx.fillStyle = "#6ee7b7";
    ctx.font = "12px sans-serif";
    ctx.fillText("Toxic PM Blocked", 245, 665);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px monospace";
    ctx.fillText(`${community.currentChallenge.completedActions}`, 420, 645);
    ctx.fillStyle = "#6ee7b7";
    ctx.font = "12px sans-serif";
    ctx.fillText("Actions Done", 420, 665);

    // Footer notice
    ctx.fillStyle = "#64748b";
    ctx.font = "11px sans-serif";
    ctx.fillText("Created with SmogShield • Free Community Clean Air Tool", 160, 725);

    // Trigger download
    const link = document.createElement("a");
    link.download = `smogshield-bulletin-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-emerald-400" />
          {isHi ? "WhatsApp और RWA जागरूकता पोस्टर" : "WhatsApp Awareness Poster Generator"}
        </h3>
        <span className="text-[11px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full font-semibold">
          1-Tap Share
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-4">
        {isHi
          ? "अपनी सोसाइटी या स्कूल के WhatsApp ग्रुप में तुरंत शेयर करने योग्य स्वच्छ-वायु बुलेटिन बनाएं।"
          : "Empower your neighborhood, apartment association, or school with instant WhatsApp-ready bulletins and downloadable image posters."}
      </p>

      {/* Poster Preview Card */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 mb-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider block">
              {community.name}
            </span>
            <span className="text-sm font-bold text-white">Daily Clean Air Bulletin</span>
          </div>
          <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/60 border border-rose-600/40 px-2 py-0.5 rounded-md">
            AQI {aqiData.aqi}
          </span>
        </div>

        <div className="space-y-1.5 text-xs text-slate-300">
          <p className="flex items-center gap-1.5 font-medium">
            <span className="text-emerald-400">🍂</span> Zero Open Leaf / Garbage Burning
          </p>
          <p className="flex items-center gap-1.5 font-medium">
            <span className="text-cyan-400">😷</span> Wear Sealed Headband N95 Outdoors
          </p>
          <p className="flex items-center gap-1.5 font-medium">
            <span className="text-amber-400">🪟</span> Ventilate Only During Solar Peak (1:30 - 3:30 PM)
          </p>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Community Impact:</span>
          <span className="text-emerald-300 font-semibold font-mono">
            {community.currentChallenge.co2AvoidedKg} kg CO2 avoided
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={copyToClipboard}
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-950/50"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? (isHi ? "कॉपी हो गया!" : "Copied!") : (isHi ? "WhatsApp टेक्स्ट कॉपी करें" : "Copy WhatsApp Text")}
        </button>

        <button
          onClick={downloadPosterImage}
          className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-cyan-950/50"
        >
          <Download className="w-4 h-4" />
          {isHi ? "पोस्टर इमेज डाउनलोड करें" : "Download PNG Poster"}
        </button>
      </div>

      {/* Hidden canvas for PNG rendering */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
