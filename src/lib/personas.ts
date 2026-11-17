import { UserProfile } from "@/types";

export const DEMO_PERSONAS: Record<string, UserProfile> = {
  family_toddler: {
    id: "persona_family_toddler",
    name: "Sharma Family (Toddler & Asthmatic Grandparent)",
    locationName: "New Delhi (South Ext), India",
    latitude: 28.5672,
    longitude: 77.2215,
    householdSize: 4,
    members: [
      {
        id: "m_1",
        name: "Aarav (Toddler)",
        role: "toddler",
        age: 3,
        sensitivities: ["allergies"]
      },
      {
        id: "m_2",
        name: "Ramesh (Grandfather)",
        role: "senior",
        age: 68,
        sensitivities: ["asthma", "heart_condition"]
      },
      {
        id: "m_3",
        name: "Neha (Mother)",
        role: "adult",
        age: 34,
        sensitivities: ["none"]
      },
      {
        id: "m_4",
        name: "Vikram (Father)",
        role: "adult",
        age: 36,
        sensitivities: ["none"]
      }
    ],
    homeType: "apartment_drafty",
    cookingFuel: "lpg_gas",
    heatingMethod: "electric_heat",
    commuteMode: "metro_train",
    commuteDurationMinutes: 35,
    budgetLevel: "moderate",
    hasAirPurifier: true,
    language: "en"
  },
  commuter_twowheeler: {
    id: "persona_commuter_twowheeler",
    name: "Kabir (Daily Two-Wheeler Commuter)",
    locationName: "East Delhi (Anand Vihar Corridor), India",
    latitude: 28.6469,
    longitude: 77.3164,
    householdSize: 2,
    members: [
      {
        id: "m_c1",
        name: "Kabir",
        role: "adult",
        age: 27,
        sensitivities: ["allergies"]
      },
      {
        id: "m_c2",
        name: "Rhea (Partner)",
        role: "adult",
        age: 26,
        sensitivities: ["none"]
      }
    ],
    homeType: "apartment_drafty",
    cookingFuel: "lpg_gas",
    heatingMethod: "none",
    commuteMode: "two_wheeler",
    commuteDurationMinutes: 50,
    budgetLevel: "low_frugal",
    hasAirPurifier: false,
    language: "en"
  },
  elderly_frugal: {
    id: "persona_elderly_frugal",
    name: "Saraswati & Jagdish (Elderly Couple, Fixed Pension)",
    locationName: "Kanpur (Civil Lines), India",
    latitude: 26.4499,
    longitude: 80.3319,
    householdSize: 2,
    members: [
      {
        id: "m_e1",
        name: "Saraswati",
        role: "senior",
        age: 72,
        sensitivities: ["copd", "heart_condition"]
      },
      {
        id: "m_e2",
        name: "Jagdish",
        role: "senior",
        age: 75,
        sensitivities: ["heart_condition"]
      }
    ],
    homeType: "independent_house",
    cookingFuel: "lpg_gas",
    heatingMethod: "wood_coal_angithi",
    commuteMode: "walking_cycling",
    commuteDurationMinutes: 15,
    budgetLevel: "low_frugal",
    hasAirPurifier: false,
    language: "hi"
  }
};

export const DEFAULT_USER_PROFILE: UserProfile = DEMO_PERSONAS.family_toddler;
