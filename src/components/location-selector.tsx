"use client";

import React, { useState } from "react";
import { useApp } from "@/context/app-context";
import { MapPin, Navigation, Check, X, Search, Globe } from "lucide-react";

export const POPULAR_CITIES = [
  { name: "New Delhi (Anand Vihar)", lat: 28.6139, lon: 77.2090, tag: "Severe Smog" },
  { name: "Kanpur (Civil Lines)", lat: 26.4499, lon: 80.3319, tag: "High Smog" },
  { name: "Patna (Boring Road)", lat: 25.5941, lon: 85.1376, tag: "High Particulate" },
  { name: "Lucknow (Hazratganj)", lat: 26.8467, lon: 80.9462, tag: "Moderate-High" },
  { name: "Kolkata (Park Street)", lat: 22.5726, lon: 88.3639, tag: "Winter Haze" },
  { name: "Mumbai (Bandra)", lat: 19.0760, lon: 72.8777, tag: "Coastal Smog" },
  { name: "Bengaluru (Koramangala)", lat: 12.9716, lon: 77.5946, tag: "Moderate" },
  { name: "Lahore (Gulberg)", lat: 31.5204, lon: 74.3587, tag: "Severe Smog" },
  { name: "Beijing (Chaoyang)", lat: 39.9042, lon: 116.4074, tag: "Industrial Smog" },
  { name: "London (Westminster)", lat: 51.5074, lon: -0.1278, tag: "Good-Moderate" },
  { name: "New York (Manhattan)", lat: 40.7128, lon: -74.0060, tag: "Good" }
];

interface LocationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LocationSelector({ isOpen, onClose }: LocationSelectorProps) {
  const { profile, setProfile, refreshAQI, language } = useApp();
  const isHi = language === "hi";
  const [search, setSearch] = useState("");
  const [customName, setCustomName] = useState("");
  const [customLat, setCustomLat] = useState("");
  const [customLon, setCustomLon] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSelectCity = (city: typeof POPULAR_CITIES[0]) => {
    setProfile({
      ...profile,
      locationName: city.name,
      latitude: city.lat,
      longitude: city.lon
    });
    onClose();
  };

  const handleGpsDetect = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const lat = Number(pos.coords.latitude.toFixed(4));
        const lon = Number(pos.coords.longitude.toFixed(4));
        setProfile({
          ...profile,
          locationName: `GPS (${lat}, ${lon})`,
          latitude: lat,
          longitude: lon
        });
        onClose();
      },
      (err) => {
        setGpsLoading(false);
        alert("GPS permission denied or timed out. Please select a city from the list.");
      },
      { timeout: 8000 }
    );
  };

  const handleCustomApply = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    if (isNaN(lat) || isNaN(lon)) {
      alert("Please enter valid decimal coordinates (e.g. Lat: 28.61, Lon: 77.20)");
      return;
    }
    setProfile({
      ...profile,
      locationName: customName.trim() || `Location (${lat}, ${lon})`,
      latitude: lat,
      longitude: lon
    });
    onClose();
  };

  const filteredCities = POPULAR_CITIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-surface-card border border-surface-border rounded-2xl p-5 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              {isHi ? "स्थान (Location) चुनें" : "Select Location & Real-time AQI"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isHi ? "अपने शहर या GPS स्थान का वास्तविक समय AQI देखें" : "Change city to load instant live air quality and weather telemetry."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Active Location Banner */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">{isHi ? "वर्तमान चयनित स्थान:" : "Current Location:"}</span>
            <span className="text-cyan-300 font-bold text-sm">{profile.locationName}</span>
            <span className="text-slate-500 font-mono text-[10px] block mt-0.5">
              {profile.latitude}° N, {profile.longitude}° E
            </span>
          </div>
          <span className="bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">
            Active
          </span>
        </div>

        {/* GPS Button */}
        <button
          onClick={handleGpsDetect}
          disabled={gpsLoading}
          className="w-full p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-950 disabled:opacity-50"
        >
          <Navigation className={`w-4 h-4 ${gpsLoading ? "animate-spin" : ""}`} />
          <span>{gpsLoading ? (isHi ? "GPS लोकेशन खोजी जा रही है..." : "Detecting GPS Location...") : (isHi ? "मेरे वर्तमान GPS स्थान का उपयोग करें" : "Use My Current GPS Location")}</span>
        </button>

        {/* City Search Bar */}
        <div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={isHi ? "शहर खोजें (उदा. Delhi, Mumbai, Kanpur...)" : "Search city (e.g. Delhi, Mumbai, Kanpur...)"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Popular Cities Grid */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            {isHi ? "प्रमुख शहर (Quick Pick):" : "Popular Cities & Hotspots:"}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
            {filteredCities.map((city, idx) => {
              const isCurrent = Math.abs(city.lat - profile.latitude) < 0.05 && Math.abs(city.lon - profile.longitude) < 0.05;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectCity(city)}
                  className={`p-2 rounded-xl text-left border transition flex items-center justify-between text-xs ${
                    isCurrent
                      ? "bg-cyan-950/60 border-cyan-500/60 text-white ring-1 ring-cyan-500/40"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  <div>
                    <span className="font-semibold block">{city.name.split("(")[0]}</span>
                    <span className="text-[10px] text-slate-400">{city.tag}</span>
                  </div>
                  {isCurrent && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Coordinates Section */}
        <form onSubmit={handleCustomApply} className="pt-3 border-t border-slate-800 space-y-2 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            {isHi ? "कस्टम निर्देशांक (Custom Coordinates):" : "Enter Custom Coordinates:"}
          </span>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="City Name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-[11px]"
            />
            <input
              type="number"
              step="0.0001"
              placeholder="Latitude"
              value={customLat}
              onChange={(e) => setCustomLat(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-[11px]"
            />
            <input
              type="number"
              step="0.0001"
              placeholder="Longitude"
              value={customLon}
              onChange={(e) => setCustomLon(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-[11px]"
            />
          </div>
          <button
            type="submit"
            className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            {isHi ? "कस्टम स्थान लागू करें" : "Apply Custom Location"}
          </button>
        </form>
      </div>
    </div>
  );
}
