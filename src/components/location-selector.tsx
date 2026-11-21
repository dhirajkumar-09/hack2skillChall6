"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/app-context";
import { MapPin, Navigation, Check, X, Search, Globe, Loader2, Sparkles, Building2 } from "lucide-react";
import { logger } from "@/lib/logger";

export const POPULAR_CITIES = [
  { name: "Patna (Boring Road)", lat: 25.5941, lon: 85.1376, tag: "Bihar · High Particulate" },
  { name: "New Delhi (Anand Vihar)", lat: 28.6139, lon: 77.2090, tag: "Delhi NCR · Severe Smog" },
  { name: "Kanpur (Civil Lines)", lat: 26.4499, lon: 80.3319, tag: "Uttar Pradesh · Industrial" },
  { name: "Lucknow (Hazratganj)", lat: 26.8467, lon: 80.9462, tag: "Uttar Pradesh · Haze" },
  { name: "Varanasi (Bhelupur)", lat: 25.3176, lon: 82.9739, tag: "Uttar Pradesh · River Basin" },
  { name: "Gaya (Civil Lines)", lat: 24.7914, lon: 85.0002, tag: "Bihar · High PM2.5" },
  { name: "Muzaffarpur (Town)", lat: 26.1209, lon: 85.3647, tag: "Bihar · Winter Smog" },
  { name: "Kolkata (Park Street)", lat: 22.5726, lon: 88.3639, tag: "West Bengal · Winter Haze" },
  { name: "Mumbai (Bandra)", lat: 19.0760, lon: 72.8777, tag: "Maharashtra · Coastal" },
  { name: "Bengaluru (Koramangala)", lat: 12.9716, lon: 77.5946, tag: "Karnataka · Moderate" },
  { name: "Hyderabad (Gachibowli)", lat: 17.3850, lon: 78.4867, tag: "Telangana · Moderate" },
  { name: "London (Westminster)", lat: 51.5074, lon: -0.1278, tag: "UK · Global Benchmark" }
];

export interface GeocodedCity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  admin2?: string;
}

interface LocationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LocationSelector({ isOpen, onClose }: LocationSelectorProps) {
  const { profile, setProfile, refreshAQI, language } = useApp();
  const isHi = language === "hi";
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodedCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customLat, setCustomLat] = useState("");
  const [customLon, setCustomLon] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Live dynamic geocoding across any city in India or worldwide
  useEffect(() => {
    if (!search || search.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            search.trim()
          )}&count=8&language=en&format=json`
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.results) {
            setSearchResults(data.results);
          } else {
            setSearchResults([]);
          }
        }
      } catch (e) {
        logger.warn("Geocoding fetch error:", e);
      } finally {
        setIsSearching(false);
      }
    }, 320);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  if (!isOpen) return null;

  const handleSelectCity = (city: { name: string; lat: number; lon: number }) => {
    setProfile({
      ...profile,
      locationName: city.name,
      latitude: city.lat,
      longitude: city.lon
    });
    onClose();
  };

  const handleSelectGeocoded = (c: GeocodedCity) => {
    const formatted = `${c.name}${c.admin1 ? `, ${c.admin1}` : ""}${c.country ? ` (${c.country})` : ""}`;
    setProfile({
      ...profile,
      locationName: formatted,
      latitude: Number(c.latitude.toFixed(4)),
      longitude: Number(c.longitude.toFixed(4))
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
          locationName: `GPS Station (${lat}°N, ${lon}°E)`,
          latitude: lat,
          longitude: lon
        });
        onClose();
      },
      (err) => {
        setGpsLoading(false);
        alert("GPS permission denied or timed out. Please type your city name in the search box.");
      },
      { timeout: 8000 }
    );
  };

  const handleCustomApply = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    if (isNaN(lat) || isNaN(lon)) {
      alert("Please enter valid decimal coordinates (e.g. Lat: 25.594, Lon: 85.137)");
      return;
    }
    setProfile({
      ...profile,
      locationName: customName.trim() || `Station (${lat}°N, ${lon}°E)`,
      latitude: lat,
      longitude: lon
    });
    onClose();
  };

  const filteredPopular = POPULAR_CITIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-labelledby="location-modal-title">
      <div className="bg-surface-card border border-surface-border rounded-2xl p-5 max-w-lg w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 id="location-modal-title" className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" aria-hidden="true" />
              {isHi ? "स्थान व स्टेशन चुनें (Live City AQI Search)" : "Search Any City · Live Station Data"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isHi 
                ? "भारत या दुनिया का कोई भी शहर खोजें, तुरंत स्टेशन डेटा लोड होगा।" 
                : "Type any city (Patna, Delhi, Gaya, Varanasi...) to pull live station telemetry."}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close location selector"
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Current Active Location Banner */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">{isHi ? "वर्तमान सक्रिय स्टेशन:" : "Currently Active Station:"}</span>
            <span className="text-cyan-300 font-bold text-sm">{profile.locationName}</span>
            <span className="text-slate-500 font-mono text-[10px] block mt-0.5">
              {profile.latitude}° N, {profile.longitude}° E
            </span>
          </div>
          <span className="bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Live Synced
          </span>
        </div>

        {/* GPS Button */}
        <button
          onClick={handleGpsDetect}
          disabled={gpsLoading}
          aria-label={isHi ? "मेरे वर्तमान GPS स्थान का उपयोग करें" : "Auto-Detect My GPS Location"}
          className="w-full p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-950 disabled:opacity-50"
        >
          <Navigation className={`w-4 h-4 ${gpsLoading ? "animate-spin" : ""}`} aria-hidden="true" />
          <span>{gpsLoading ? (isHi ? "GPS लोकेशन खोजी जा रही है..." : "Detecting Exact GPS Station...") : (isHi ? "मेरे वर्तमान GPS स्थान का उपयोग करें" : "Auto-Detect My GPS Location")}</span>
        </button>

        {/* Dynamic City Search Bar */}
        <div className="space-y-1.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" aria-hidden="true" />
            <input
              type="text"
              aria-label={isHi ? "शहर या निगरानी स्टेशन खोजें" : "Search city or monitoring station"}
              placeholder={isHi ? "कोई भी शहर टाइप करें (उदा. Patna, Gaya, Varanasi, Lucknow...)" : "Type any city name (e.g. Patna, Varanasi, Gaya, London...)"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              autoFocus
            />
            {isSearching && (
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin absolute right-3 top-2.5" />
            )}
          </div>

          {/* Dynamic Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="p-1 rounded-xl bg-slate-900 border border-cyan-500/50 space-y-1 max-h-48 overflow-y-auto scrollbar-thin shadow-xl">
              <span className="text-[10px] text-cyan-300 font-bold px-2 pt-1 uppercase tracking-wider block">
                Found {searchResults.length} matching stations:
              </span>
              {searchResults.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleSelectGeocoded(city)}
                  className="w-full p-2 rounded-lg text-left hover:bg-slate-800 text-xs transition flex items-center justify-between group"
                >
                  <div>
                    <span className="font-bold text-white group-hover:text-cyan-300 block">
                      {city.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {[city.admin1, city.country].filter(Boolean).join(", ")}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {city.latitude.toFixed(2)}°N, {city.longitude.toFixed(2)}°E
                  </span>
                </button>
              ))}
            </div>
          )}

          {search.trim().length >= 2 && !isSearching && searchResults.length === 0 && (
            <p className="text-[11px] text-amber-300 px-1">
              No direct geocoding match for &quot;{search}&quot;. You can select from popular stations below or enter custom coordinates.
            </p>
          )}
        </div>

        {/* Popular Cities Quick Grid */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block flex items-center justify-between">
            <span>{isHi ? "प्रमुख भारतीय शहर (Quick Stations):" : "Popular Indian Cities & Stations:"}</span>
            <span className="text-[10px] text-slate-500">1-Click Instant Sync</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
            {filteredPopular.map((city, idx) => {
              const isCurrent = Math.abs(city.lat - profile.latitude) < 0.05 && Math.abs(city.lon - profile.longitude) < 0.05;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectCity({ name: city.name, lat: city.lat, lon: city.lon })}
                  className={`p-2 rounded-xl text-left border transition flex items-center justify-between text-xs ${
                    isCurrent
                      ? "bg-cyan-950/70 border-cyan-500 text-white ring-1 ring-cyan-500/50"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
                  }`}
                >
                  <div>
                    <span className="font-semibold block">{city.name.split("(")[0]}</span>
                    <span className="text-[10px] text-slate-400 block">{city.tag}</span>
                  </div>
                  {isCurrent && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Coordinates Section */}
        <form onSubmit={handleCustomApply} className="pt-2 border-t border-slate-800 space-y-2 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            {isHi ? "कस्टम निर्देशांक (Custom Station Coordinates):" : "Enter Exact Station Latitude & Longitude:"}
          </span>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Station / City Name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-cyan-500"
            />
            <input
              type="number"
              step="0.0001"
              placeholder="Latitude (e.g. 25.59)"
              value={customLat}
              onChange={(e) => setCustomLat(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-[11px] focus:outline-none focus:border-cyan-500"
            />
            <input
              type="number"
              step="0.0001"
              placeholder="Longitude (e.g. 85.13)"
              value={customLon}
              onChange={(e) => setCustomLon(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-[11px] focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            {isHi ? "कस्टम स्टेशन लोड करें" : "Load Custom Station"}
          </button>
        </form>
      </div>
    </div>
  );
}
