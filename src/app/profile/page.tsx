"use client";

import React, { useState } from "react";
import { useApp } from "@/context/app-context";
import { PersonaSwitcher } from "@/components/persona-switcher";
import { UserProfile, Sensitivity, MemberRole, HomeType, CookingFuel, HeatingMethod, CommuteMode } from "@/types";
import { 
  UserCircle2, 
  MapPin, 
  Users, 
  Home, 
  Flame, 
  Bike, 
  Save, 
  Sparkles, 
  Plus, 
  Trash2,
  CheckCircle,
  Navigation
} from "lucide-react";
import { getTranslation } from "@/lib/i18n";

export default function ProfilePage() {
  const { profile, setProfile, language, setLanguage } = useApp();
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const isHi = language === "hi";
  const t = getTranslation(language);

  // Sync if profile changes from persona switcher
  React.useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            latitude: Number(pos.coords.latitude.toFixed(4)),
            longitude: Number(pos.coords.longitude.toFixed(4)),
            locationName: "Detected GPS Location"
          }));
        },
        (err) => {
          alert("Could not detect location. Using coordinates directly.");
        }
      );
    }
  };

  const addMember = () => {
    setFormData(prev => ({
      ...prev,
      members: [
        ...prev.members,
        {
          id: `m_${Date.now()}`,
          name: `Member ${prev.members.length + 1}`,
          role: "adult" as MemberRole,
          age: 30,
          sensitivities: ["none" as Sensitivity]
        }
      ],
      householdSize: prev.members.length + 1
    }));
  };

  const removeMember = (id: string) => {
    if (formData.members.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== id),
      householdSize: prev.members.length - 1
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
          {isHi ? "व्यक्तिगत सेटिंग्स" : "Household & Lifestyle Profile"}
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
          {t.profile.title}
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-lg">
          Personalized routines and impact formulas automatically adapt to this configuration.
        </p>
      </div>

      {/* Demo Persona Switcher */}
      <PersonaSwitcher />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Location & Language */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Location & Coordinates
            </h3>
            <button
              type="button"
              onClick={handleDetectLocation}
              className="text-xs bg-slate-900 border border-slate-800 text-cyan-300 hover:text-white px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
            >
              <Navigation className="w-3 h-3" />
              Auto-detect GPS
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">City / Region Name</label>
              <input
                type="text"
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Household Members & Sensitivities */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              {t.profile.householdMembers}
            </h3>
            <button
              type="button"
              onClick={addMember}
              className="text-xs bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 px-2.5 py-1 rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add Member
            </button>
          </div>

          <div className="space-y-3">
            {formData.members.map((m, idx) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end text-xs"
              >
                <div>
                  <label className="text-slate-400 block mb-1 text-[11px]">Name</label>
                  <input
                    type="text"
                    value={m.name}
                    onChange={(e) => {
                      const updated = [...formData.members];
                      updated[idx].name = e.target.value;
                      setFormData({ ...formData, members: updated });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 text-[11px]">Role & Age</label>
                  <div className="flex gap-1.5">
                    <select
                      value={m.role}
                      onChange={(e) => {
                        const updated = [...formData.members];
                        updated[idx].role = e.target.value as MemberRole;
                        setFormData({ ...formData, members: updated });
                      }}
                      className="w-2/3 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[11px]"
                    >
                      <option value="toddler">Toddler (0-4)</option>
                      <option value="child">Child (5-12)</option>
                      <option value="adult">Adult</option>
                      <option value="senior">Senior (65+)</option>
                    </select>
                    <input
                      type="number"
                      value={m.age}
                      onChange={(e) => {
                        const updated = [...formData.members];
                        updated[idx].age = parseInt(e.target.value) || 0;
                        setFormData({ ...formData, members: updated });
                      }}
                      className="w-1/3 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 text-[11px]">Sensitivities</label>
                  <select
                    value={m.sensitivities[0] || "none"}
                    onChange={(e) => {
                      const updated = [...formData.members];
                      updated[idx].sensitivities = [e.target.value as Sensitivity];
                      setFormData({ ...formData, members: updated });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[11px]"
                  >
                    <option value="none">None / Healthy</option>
                    <option value="asthma">Asthma / Wheezing</option>
                    <option value="copd">COPD / Bronchitis</option>
                    <option value="heart_condition">Heart / Cardiovascular</option>
                    <option value="allergies">Allergies / Sinusitis</option>
                    <option value="pregnancy">Pregnancy</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeMember(m.id)}
                    disabled={formData.members.length <= 1}
                    className="p-1.5 text-slate-500 hover:text-rose-400 disabled:opacity-20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Home & Energy */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Home className="w-4 h-4 text-cyan-400" />
            Home Type, Cooking & Commute
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Home Envelope Type</label>
              <select
                value={formData.homeType}
                onChange={(e) => setFormData({ ...formData, homeType: e.target.value as HomeType })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="apartment_sealed">Apartment (Sealed Double Glazing)</option>
                <option value="apartment_drafty">Apartment (Drafty Windows/Doors)</option>
                <option value="independent_house">Independent House / Villa</option>
                <option value="slum_informal">Informal / Open Ventilation</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Cooking Fuel</label>
              <select
                value={formData.cookingFuel}
                onChange={(e) => setFormData({ ...formData, cookingFuel: e.target.value as CookingFuel })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="lpg_gas">LPG Cylinders / Piped Gas</option>
                <option value="induction_electric">Induction / Electric Cooktop</option>
                <option value="biomass_wood_coal">Wood / Biomass / Coal</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Heating Method in Winter</label>
              <select
                value={formData.heatingMethod}
                onChange={(e) => setFormData({ ...formData, heatingMethod: e.target.value as HeatingMethod })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="electric_heat">Electric Heater / Radiator</option>
                <option value="wood_coal_angithi">Open Angithi / Firewood / Coal</option>
                <option value="none">None (Blankets only)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Daily Commute Mode</label>
              <select
                value={formData.commuteMode}
                onChange={(e) => setFormData({ ...formData, commuteMode: e.target.value as CommuteMode })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="metro_train">Metro Rail / Suburban Train</option>
                <option value="two_wheeler">Two-Wheeler (Motorcycle / Scooter)</option>
                <option value="car_ac">Car (Personal / Cab with AC)</option>
                <option value="bus">Public Bus</option>
                <option value="walking_cycling">Walking / Cycling</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              Profile updated and formulas recalculated!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950 transition"
          >
            <Save className="w-4 h-4" />
            Save Profile & Update Plans
          </button>
        </div>
      </form>
    </div>
  );
}
