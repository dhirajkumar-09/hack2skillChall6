"use client";

import React, { useState } from "react";
import { ImpactBreakdown } from "@/types";
import { Info, ChevronDown, ChevronUp, BookOpen, AlertCircle, ExternalLink } from "lucide-react";

interface ImpactModalProps {
  breakdowns: ImpactBreakdown[];
  language?: 'en' | 'hi';
}

export function ImpactModal({ breakdowns, language = 'en' }: ImpactModalProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isHi = language === 'hi';

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-5 h-5 text-cyan-400" />
        <h3 className="text-base font-bold text-white">
          {isHi ? "पारदर्शी गणना और वैज्ञानिक प्रमाण" : "Traceable Methodology & Scientific Sources"}
        </h3>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        {isHi
          ? "हम कभी भी स्वास्थ्य या पर्यावरण संबंधी आंकड़ों का मनमाना दावा नहीं करते। नीचे दिए गए प्रत्येक सूत्र का स्रोत देखें।"
          : "Every estimate in SmogShield is backed by published peer-reviewed environmental health literature and explicit mathematical formulas."}
      </p>

      {/* Medical Disclaimer Banner */}
      <div className="mb-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex items-start gap-2.5 text-xs text-slate-300">
        <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-cyan-300 font-semibold block">
            {isHi ? "महत्वपूर्ण स्वास्थ्य एवं सांख्यिकी सूचना:" : "Public Health Framing Notice:"}
          </strong>
          {isHi
            ? "सिगरेट समतुल्य और PM2.5 इनहेलेशन के आंकड़े जन-स्वास्थ्य जोखिम संचार हेतु सांख्यिकीय मॉडल हैं, कोई व्यक्तिगत मेडिकल निदान नहीं।"
            : "Particulate inhalation and cigarette equivalency are statistical public-health communication models (Berkeley Earth / EPA), not clinical diagnostic measurements."}
        </div>
      </div>

      <div className="space-y-3">
        {breakdowns.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden transition"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-3.5 text-left flex items-center justify-between hover:bg-slate-800/40 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">{item.label}</span>
                    <span className="text-xs bg-slate-800 text-cyan-300 px-2 py-0.5 rounded-full font-mono">
                      {item.value} {item.unit}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.context}</p>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                )}
              </button>

              {isOpen && (
                <div className="p-3.5 pt-0 border-t border-slate-800/80 bg-slate-950/40 space-y-3 text-xs">
                  {/* Formula Box */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      {isHi ? "गणितीय सूत्र (Formula):" : "Mathematical Formula:"}
                    </span>
                    <code className="block p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-cyan-300 text-[11px] overflow-x-auto">
                      {item.formula}
                    </code>
                  </div>

                  {/* Assumptions */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      {isHi ? "मुख्य मान्यताएं (Assumptions):" : "Underlying Assumptions:"}
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {item.assumptions.map((assump, aIdx) => (
                        <li key={aIdx} className="leading-relaxed">{assump}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Scientific Citations */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      {isHi ? "वैज्ञानिक स्रोत और संदर्भ:" : "Scientific Sources:"}
                    </span>
                    <div className="space-y-1">
                      {item.scientificSources.map((src, sIdx) => (
                        <div key={sIdx} className="p-2 rounded bg-slate-900/80 border border-slate-800/60 text-[11px]">
                          <span className="font-semibold text-white block">{src.title}</span>
                          <span className="text-slate-400 italic block">{src.citation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
