"use client";

import React, { useState } from "react";
import { calculateRoomAirExchange } from "@/lib/impact-engine";
import { Wrench, CheckCircle2, DollarSign, Fan, Sliders, ArrowRight } from "lucide-react";

interface CrBoxGuideProps {
  language?: 'en' | 'hi';
}

export function CrBoxGuide({ language = 'en' }: CrBoxGuideProps) {
  const isHi = language === 'hi';
  const [roomLength, setRoomLength] = useState<number>(14);
  const [roomWidth, setRoomWidth] = useState<number>(12);
  const [ceilingHeight, setCeilingHeight] = useState<number>(9);
  const [stepIndex, setStepIndex] = useState<number>(0);

  const exchange = calculateRoomAirExchange(roomLength, roomWidth, ceilingHeight, 260);
  const diyCostInr = 3500;
  const commercialPurifierInr = 14500;
  const moneySaved = commercialPurifierInr - diyCostInr;

  const steps = isHi
    ? [
        {
          title: "कदम 1: 4 फिल्टरों से क्यूब (Cube) बनाएं",
          desc: "4 MERV-13 (या HEPA ग्रेड) फिल्टर लें। तीरों का निशान अंदर की ओर रखें और कोनों को मजबूत डक्ट टेप से चिपका दें।"
        },
        {
          title: "कदम 2: निचला तल (Base) कार्डबोर्ड से सील करें",
          desc: "फिल्टर क्यूब के नीचे चौकोर कार्डबोर्ड का टुकड़ा लगाएं और किनारों को टेप से एयरटाइट कर दें ताकि नीचे से धूल न घुसे।"
        },
        {
          title: "कदम 3: 20-इंच बॉक्स पंखा ऊपर रखें",
          desc: "पंखा ऊपर की तरफ हवा फेंकने (Blowing UP) की दिशा में रखें। पंखे और फिल्टर के बीच के जोड़ों पर डक्ट टेप लगाएं।"
        },
        {
          title: "कदम 4: 14-इंच कार्डबोर्ड श्राउड (Shroud) लगाएं",
          desc: "पंखे के मुंह पर गोल 14-इंच छिद्र वाला कार्डबोर्ड लगाएं। यह ब्लेड के किनारों से हवा के भंवर (vortex) को रोककर दक्षता 25% बढ़ाता है।"
        }
      ]
    : [
        {
          title: "Step 1: Arrange 4 Filters into a Cube",
          desc: "Place 4 MERV-13 (20x20-inch) filters into a square. Ensure airflow direction arrows point INWARD toward the center plenum. Tape vertical seams firmly with duct tape."
        },
        {
          title: "Step 2: Seal Cardboard Bottom Floor",
          desc: "Tape a 20x20-inch cardboard square to the bottom of the filter cube, creating an airtight base floor."
        },
        {
          title: "Step 3: Mount the 20-inch Box Fan",
          desc: "Place the box fan on top, oriented so it draws air UPWARD through the filters and exhausts clean air into the ceiling. Tape all 4 top perimeter edges."
        },
        {
          title: "Step 4: Add the Critical 14-Inch Cardboard Shroud",
          desc: "Cut a 14-inch circular opening in a cardboard sheet and tape it to the front face of the fan. This simple hack eliminates blade-tip backflow, boosting CADR by ~25%."
        }
      ];

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Fan className="w-5 h-5 text-emerald-400" />
          {isHi ? "देसी एयर प्यूरीफायर (Corsi-Rosenthal Box) कैलकुलेटर" : "Corsi-Rosenthal DIY Box Fan Builder"}
        </h3>
        <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
          CADR ~260 CFM
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-4">
        {isHi
          ? "₹15,000 के महंगे कमर्शियल प्यूरीफायर की जगह केवल ₹3,500 में अस्पताल-ग्रेड स्वच्छ हवा बनाएं।"
          : "Engineered by aerosol scientists at UC Davis. Delivers 250+ CFM clean air delivery at 1/4th the price of commercial HEPA units."}
      </p>

      {/* Cost Comparison Bar */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 mb-5">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-300 font-medium">
            {isHi ? "लागत तुलना:" : "Cost Comparison:"}
          </span>
          <span className="text-emerald-400 font-bold font-mono">
            {isHi ? `बचत: ₹${moneySaved.toLocaleString()}` : `Saves ₹${moneySaved.toLocaleString()}`}
          </span>
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">DIY Corsi-Rosenthal Box</span>
            <span className="text-emerald-300 font-bold font-mono">₹{diyCostInr.toLocaleString()}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "24%" }} />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Commercial HEPA (CADR 250)</span>
            <span className="line-through font-mono">₹{commercialPurifierInr.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Room Sizer Sliders */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 mb-5">
        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5" />
          {isHi ? "कमरे का आकार व CADR उपयुक्तता" : "Room Size & Air Changes (ACH)"}
        </span>

        <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">
              Length: <strong className="text-white">{roomLength} ft</strong>
            </label>
            <input
              type="range"
              min="8"
              max="26"
              value={roomLength}
              onChange={(e) => setRoomLength(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">
              Width: <strong className="text-white">{roomWidth} ft</strong>
            </label>
            <input
              type="range"
              min="8"
              max="24"
              value={roomWidth}
              onChange={(e) => setRoomWidth(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>

        {/* Calculation Output */}
        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 block">Room Area</span>
            <span className="text-xs font-bold text-white font-mono">{exchange.roomAreaSqFt} sq ft</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Air Changes/Hr</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">{exchange.currentAch} ACH</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Status</span>
            <span className="text-xs font-bold text-cyan-300">{exchange.adequacyStatus}</span>
          </div>
        </div>
      </div>

      {/* Interactive Assembly Steps */}
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          {isHi ? "4-कदम निर्माण गाइड" : "4-Step Assembly Blueprint"}
        </span>

        <div className="flex items-center gap-1.5 mb-3">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStepIndex(idx)}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                idx === stepIndex ? "bg-emerald-400" : "bg-slate-800"
              }`}
            />
          ))}
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 relative">
          <span className="text-xs font-bold text-emerald-300 block mb-1">
            {steps[stepIndex].title}
          </span>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {steps[stepIndex].desc}
          </p>

          <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
            <button
              disabled={stepIndex === 0}
              onClick={() => setStepIndex(i => i - 1)}
              className="px-2.5 py-1 text-slate-400 disabled:opacity-30 hover:text-white"
            >
              Previous
            </button>
            <span className="text-[11px] text-slate-500 font-mono">
              {stepIndex + 1} of {steps.length}
            </span>
            <button
              disabled={stepIndex === steps.length - 1}
              onClick={() => setStepIndex(i => i + 1)}
              className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 flex items-center gap-1 disabled:opacity-30"
            >
              Next <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
