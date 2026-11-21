"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/app-context";
import { ChatMessage } from "@/types";
import { 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle 
} from "lucide-react";
import { getTranslation } from "@/lib/i18n";
import { logger } from "@/lib/logger";

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface ISpeechRecognition {
  lang: string;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: () => void;
  onend: () => void;
}

interface WindowWithSpeech extends Window {
  SpeechRecognition?: new () => ISpeechRecognition;
  webkitSpeechRecognition?: new () => ISpeechRecognition;
}

export default function ChatPage() {
  const { profile, aqiData, language, geminiApiKey } = useApp();
  const isHi = language === "hi";
  const t = getTranslation(language);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m_welcome",
      sender: "assistant",
      text: isHi
        ? `नमस्ते! मैं आपका स्मॉगशील्ड AI सहायक हूँ। वर्तमान में आपके स्थान पर AQI **${aqiData.aqi}** (${aqiData.category}) है और PM2.5 स्तर **${aqiData.pm25} µg/m³** है।\n\nआप मुझसे पूछ सकते हैं: क्या बच्चे बाहर खेल सकते हैं? खिड़कियां कब खोलें? देसी प्यूरीफायर कैसे बनाएं?`
        : `Hello! I'm your SmogShield Assistant, grounded in your live air quality (**AQI ${aqiData.aqi} - ${aqiData.category}**, PM2.5: **${aqiData.pm25} µg/m³**) in ${profile.locationName.split(",")[0]}.\n\nHow can I help protect your household today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: isHi
        ? [
            "क्या आज बच्चे बाहर खेल सकते हैं?",
            "खिड़कियां खोलने का सुरक्षित समय कब है?",
            "सस्ता देसी प्यूरीफायर कैसे बनाएं?"
          ]
        : [
            "Can my kid play outside today?",
            "Is it okay to open windows now?",
            "Cheapest way to clean my bedroom air?"
          ]
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          history: messages,
          profile,
          aqiData,
          language,
          apiKey: geminiApiKey
        })
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: ChatMessage = {
          id: `bot_${Date.now()}`,
          sender: "assistant",
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          dataGrounded: {
            aqiUsed: aqiData.aqi,
            locationUsed: profile.locationName,
            profileContext: `${profile.householdSize} members (${profile.members.map(m => m.role).join(", ")})`,
            citations: data.citations || []
          },
          suggestedFollowUps: data.suggestedFollowUps || []
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (e) {
      logger.warn("Chat API call error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Optional Voice Input via Web Speech API
  const toggleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice input is not supported in this browser. Please type your query.");
      return;
    }

    const win = window as unknown as WindowWithSpeech;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRec) return;

    const recognition = new SpeechRec();
    recognition.lang = language === "hi" ? "hi-IN" : "en-US";
    recognition.interimResults = false;

    if (!isListening) {
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript || "";
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
      {/* Chat Header */}
      <div className="flex items-center justify-between pb-2 border-b border-surface-border">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
            {t.chat.groundedBadge}
          </span>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            {t.chat.title}
          </h1>
        </div>
        <div className="text-right text-[11px] text-slate-400">
          <div className="flex items-center justify-end gap-1 mb-0.5">
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ✨ Gemini 3.5 Flash Active
            </span>
          </div>
          <span>Grounded on: </span>
          <strong className="text-cyan-300 font-mono">AQI {aqiData.aqi}</strong>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-md rounded-2xl p-4 shadow-lg text-xs leading-relaxed space-y-2 ${
                  isUser
                    ? "bg-cyan-600 text-white rounded-br-none"
                    : "bg-surface-card border border-surface-border text-slate-200 rounded-bl-none"
                }`}
              >
                {/* Text Body */}
                <div className="whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* Grounding / Citations Box if present */}
                {msg.dataGrounded && msg.dataGrounded.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-700/60 text-[10px] text-slate-400 space-y-1">
                    <span className="font-semibold text-cyan-300 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      Grounded Citations:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {msg.dataGrounded.citations.map((c, idx) => (
                        <li key={idx} className="italic">{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <span className={`text-[9px] block text-right ${isUser ? "text-cyan-200" : "text-slate-500"}`}>
                  {msg.timestamp}
                </span>
              </div>

              {/* Follow-up chips if latest message from assistant */}
              {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-md">
                  {msg.suggestedFollowUps.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip)}
                      className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-[11px] text-cyan-300 transition hover:bg-slate-800"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-3 bg-surface-card rounded-2xl border border-surface-border w-fit animate-pulse">
            <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Consulting WHO air quality guidelines & local AQI...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2 border-t border-surface-border"
      >
        <button
          type="button"
          onClick={toggleVoiceInput}
          className={`p-2.5 rounded-xl border transition ${
            isListening
              ? "bg-rose-600 text-white border-rose-500 animate-pulse"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
          }`}
          title="Voice input (Speech to Text)"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.chat.placeholder}
          className="flex-1 bg-surface-card border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
        />

        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition shadow-lg shadow-cyan-950"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
