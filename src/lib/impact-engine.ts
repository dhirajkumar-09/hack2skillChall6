import { HouseholdMember, CommuteMode, HeatingMethod, MemberRiskAssessment, ImpactBreakdown } from "@/types";

export { calculateAQIFromPM25 } from "./aqi-service";

/**
 * Breathing rates in cubic meters per hour (m3/h)
 * Sources: EPA Exposure Factors Handbook (2011), WHO Air Quality Guidelines
 */
export const BREATHING_RATES: Record<string, { resting: number; active: number }> = {
  toddler: { resting: 0.35, active: 0.70 },
  child: { resting: 0.50, active: 1.00 },
  adult: { resting: 0.55, active: 1.25 },
  senior: { resting: 0.45, active: 0.90 }
};

/**
 * Filtration efficiencies for different interventions
 */
export const FILTRATION_EFFICIENCY = {
  n95_mask: 0.95,
  surgical_mask: 0.38,
  cloth_mask: 0.18,
  hepa_room_purifier: 0.82,
  cr_box_purifier: 0.85,
  sealed_room_no_purifier: 0.40,
  drafty_room_no_purifier: 0.15
};

/**
 * Calculate member-specific risk and baseline PM2.5 inhalation
 */
export function calculateMemberRisk(
  member: HouseholdMember,
  pm25Concentration: number,
  indoorPm25Concentration: number,
  hoursOutdoorDaily: number = 2.5
): MemberRiskAssessment {
  const rates = BREATHING_RATES[member.role] || BREATHING_RATES.adult;
  const hoursIndoor = Math.max(0, 24 - hoursOutdoorDaily);

  // Inhaled mass = (Outdoor hours * outdoor rate * outdoor conc) + (Indoor hours * indoor rate * indoor conc)
  const outdoorInhaledUg = hoursOutdoorDaily * rates.active * pm25Concentration;
  const indoorInhaledUg = hoursIndoor * rates.resting * indoorPm25Concentration;
  const totalInhaledUg = Math.round(outdoorInhaledUg + indoorInhaledUg);

  // Berkeley Earth formula: 22 ug/m3 for 24h = ~1 cigarette equivalent
  // An average 24h adult inhalation volume is ~15 m3, so 22 ug/m3 * 15 m3 = ~330 ug inhaled PM2.5 per cigarette equivalent.
  const cigaretteEquivDay = Number((totalInhaledUg / 330).toFixed(1));

  // Risk evaluation based on sensitivity + age
  let riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' | 'Critical' = 'Low';
  let keyWarning = "Routine air quality precautions advised.";

  const hasHighSensitivity = member.sensitivities.some(s => 
    s === 'asthma' || s === 'copd' || s === 'heart_condition' || s === 'pregnancy' || s === 'allergies'
  );

  if (pm25Concentration > 250) { // Severe / Hazardous
    riskLevel = hasHighSensitivity || member.role === 'toddler' || member.role === 'senior' 
      ? 'Critical' 
      : 'Severe';
    keyWarning = hasHighSensitivity
      ? `Severe smog alert! Inhaling ~${totalInhaledUg} µg PM2.5/day (~${cigaretteEquivDay} cigs). Keep indoors with active filtration; keep rescue inhaler/medication on hand.`
      : `Hazardous outdoor air. Minimize all outdoor exposure; wear a sealed N95/FFP2 mask if commuting.`;
  } else if (pm25Concentration > 120) { // Very Unhealthy
    riskLevel = hasHighSensitivity || member.role === 'toddler' || member.role === 'senior'
      ? 'Severe'
      : 'High';
    keyWarning = hasHighSensitivity
      ? `High vulnerability to airway constriction and cardiovascular stress. Restrict outdoor physical activity.`
      : `High particulate levels. Avoid outdoor exercise and keep doors/windows sealed.`;
  } else if (pm25Concentration > 60) { // Moderate to Unhealthy
    riskLevel = hasHighSensitivity ? 'High' : 'Moderate';
    keyWarning = hasHighSensitivity
      ? `Sensitive lungs may experience coughing, irritation, or shortness of breath.`
      : `Acceptable for brief periods, but sensitive groups should limit prolonged exertion.`;
  } else {
    riskLevel = 'Low';
    keyWarning = "Air quality is within acceptable safety parameters.";
  }

  return {
    memberId: member.id,
    name: member.name,
    role: member.role,
    riskLevel,
    keyWarning,
    inhalationBaselineUg: totalInhaledUg,
    cigaretteEquivDay
  };
}

/**
 * Calculate CADR and Air Changes per Hour for Corsi-Rosenthal / Purifier
 */
export function calculateRoomAirExchange(
  roomLengthFt: number,
  roomWidthFt: number,
  ceilingHeightFt: number = 9,
  purifierCadrCfm: number = 250
) {
  const roomVolumeCuFt = roomLengthFt * roomWidthFt * ceilingHeightFt;
  const ach = Number(((purifierCadrCfm * 60) / roomVolumeCuFt).toFixed(1));
  const targetAch = 5.0; // 5 air changes per hour recommended for smog reduction
  const recommendedCadr = Math.round((roomVolumeCuFt * targetAch) / 60);

  let adequacyStatus: 'Sufficient' | 'Optimal' | 'Undersized' = 'Optimal';
  if (ach < 3.5) adequacyStatus = 'Undersized';
  else if (ach > 6.0) adequacyStatus = 'Sufficient';

  return {
    roomVolumeCuFt,
    roomAreaSqFt: roomLengthFt * roomWidthFt,
    currentAch: ach,
    recommendedCadrCfm: recommendedCadr,
    adequacyStatus
  };
}

/**
 * Calculate emission and cost savings for sustainable commuter and home swaps
 */
export function calculateSwapImpact(
  commuteMode: CommuteMode,
  commuteDurationMinutes: number,
  heatingMethod: HeatingMethod,
  daysPerWeek: number = 5
) {
  // Estimated commute distance round trip (km) based on duration
  const estimatedSpeedKmH = commuteMode === 'metro_train' ? 35 : commuteMode === 'car_ac' ? 22 : 25;
  const distanceKmRoundTrip = Number(((commuteDurationMinutes * 2 / 60) * estimatedSpeedKmH).toFixed(1));

  let monthlyCo2eAvoidedKg = 0;
  let monthlyPm25AvoidedGrams = 0;
  let monthlyMoneySavedInr = 0;

  // Swap solo car/two-wheeler to Metro
  if (commuteMode === 'car_ac') {
    // Car petrol solo: ~180 g CO2/km vs Metro: ~25 g CO2/km -> ~155 g CO2/km saved
    // Cost: ~₹9/km fuel + parking vs ₹50 roundtrip metro
    const daysMonth = daysPerWeek * 4.3;
    const monthlyKm = distanceKmRoundTrip * daysMonth;
    monthlyCo2eAvoidedKg = Math.round(monthlyKm * 0.155);
    monthlyPm25AvoidedGrams = Math.round(monthlyKm * 0.08); // brake, tire & tailpipe PM
    monthlyMoneySavedInr = Math.round((monthlyKm * 8.5) - (daysMonth * 60));
  } else if (commuteMode === 'two_wheeler') {
    // Two wheeler petrol: ~55 g CO2/km vs Metro: ~25 g CO2/km -> ~30 g CO2/km saved
    const daysMonth = daysPerWeek * 4.3;
    const monthlyKm = distanceKmRoundTrip * daysMonth;
    monthlyCo2eAvoidedKg = Math.round(monthlyKm * 0.030);
    monthlyPm25AvoidedGrams = Math.round(monthlyKm * 0.05); // high 2-wheeler tailpipe PM
    monthlyMoneySavedInr = Math.round((monthlyKm * 2.2) - (daysMonth * 50));
  }

  // Swap wood/coal angithi to electric heating
  let heatingCo2eMonthlyKg = 0;
  let heatingPmSavedGrams = 0;
  if (heatingMethod === 'wood_coal_angithi') {
    // Burning ~3 kg raw biomass/wood/coal per winter night emits ~120g PM2.5 and ~4.8 kg CO2 directly indoors
    heatingCo2eMonthlyKg = Math.round(4.8 * 30);
    heatingPmSavedGrams = Math.round(120 * 30);
  }

  return {
    distanceKmRoundTrip,
    commuteSwap: {
      monthlyCo2eAvoidedKg,
      monthlyPm25AvoidedGrams,
      monthlyMoneySavedInr: Math.max(0, monthlyMoneySavedInr)
    },
    heatingSwap: {
      monthlyCo2eAvoidedKg: heatingCo2eMonthlyKg,
      monthlyPmSavedGrams: heatingPmSavedGrams
    }
  };
}

/**
 * Structured Explanations with Peer-Reviewed Citations for Impact Explainer
 */
export function getDetailedImpactBreakdowns(
  dailyPmAvoidedUg: number,
  cigarettesAvoided: number,
  co2SavedKg: number,
  moneySavedInr: number
): ImpactBreakdown[] {
  return [
    {
      label: "Inhaled PM2.5 Avoided",
      value: `${dailyPmAvoidedUg.toLocaleString()}`,
      unit: "µg / day",
      context: "Mass of microscopic fine particulate matter prevented from entering deep alveolar lung tissues.",
      formula: "Inhaled PM2.5 = Volume Inhaled (m³) × Ambient PM2.5 Concentration (µg/m³) × Protection Efficiency (%)",
      assumptions: [
        "Adult sedentary resting breathing volume: ~0.55 m³/hour; active commuting breathing volume: ~1.25 m³/hour (EPA Exposure Factors).",
        "Properly fitted N95/FFP2 respirator achieves ~95% particle filtration efficiency across PM2.5 size range.",
        "Indoor HEPA / Corsi-Rosenthal filter maintains ~80-85% reduction against unconditioned outdoor air."
      ],
      scientificSources: [
        {
          title: "WHO Global Air Quality Guidelines (2021)",
          citation: "World Health Organization. Particulate matter (PM2.5 and PM10) ambient health guidelines."
        },
        {
          title: "U.S. EPA Exposure Factors Handbook (2011)",
          citation: "Table 6-1: Recommended values for inhalation rates by age and activity level."
        }
      ]
    },
    {
      label: "Cigarette Equivalent Avoided",
      value: `${cigarettesAvoided}`,
      unit: "cigarettes / day equivalent",
      context: "Epidemiological statistical cardiorespiratory mortality proxy developed by Berkeley Earth.",
      formula: "Cigarette Equivalent = (PM2.5 Exposure in µg/m³ ÷ 22 µg/m³) × (Exposure Hours ÷ 24 hours)",
      assumptions: [
        "1 cigarette per day has roughly the same statistical all-cause mortality impact as breathing 22 µg/m³ of PM2.5 over 24 hours (Berkeley Earth, 2015).",
        "Important limitation: This is a statistical public-health communication equivalence, NOT a biochemical identity. Smog particles do not contain tobacco smoke alkaloids like nicotine, but contain carcinogenic PAHs, black carbon, sulfates, and heavy metals.",
        "Never present this framing as a personal clinical medical diagnosis."
      ],
      scientificSources: [
        {
          title: "Air Pollution and Cigarette Equivalence (2015)",
          citation: "Muller, R., Muller, E., & Rohde, R. (Berkeley Earth, 2015). Equivalence of air pollution to cigarette smoking."
        },
        {
          title: "Global Burden of Disease (The Lancet, 2020)",
          citation: "Comparative risk assessment of 87 environmental and occupational risks."
        }
      ]
    },
    {
      label: "CO2e Greenhouse Gas Avoided",
      value: `${co2SavedKg}`,
      unit: "kg CO2e / week",
      context: "Direct climate warming greenhouse gases avoided by adopting public transit or cleaner heating.",
      formula: "CO2e Avoided = Distance Traveled (km) × (Emissions Factor Base Mode - Emissions Factor Clean Mode)",
      assumptions: [
        "Average petrol 4-wheeler emissions: 175-192 g CO2e / km (DEFRA / ARAI).",
        "Delhi Metro grid-average operational emissions: ~25 g CO2e / passenger-km.",
        "Avoiding open burning of 1 kg dry garden biomass/waste avoids ~1.4 kg CO2e plus toxic VOCs."
      ],
      scientificSources: [
        {
          title: "IPCC Guidelines for National GHG Inventories (2019)",
          citation: "Volume 2: Energy, Chapter 3: Mobile Combustion Emission Factors."
        },
        {
          title: "CPCB Urban Transport Emission Factor Reference (2022)",
          citation: "Central Pollution Control Board, Ministry of Environment, Forest and Climate Change."
        }
      ]
    },
    {
      label: "Financial Savings",
      value: `₹${moneySavedInr.toLocaleString()}`,
      unit: "INR estimated",
      context: "Direct out-of-pocket savings from fuel, parking, or DIY Corsi-Rosenthal purifier fabrication.",
      formula: "Net Savings = Avoided Vehicle Fuel & Parking Costs - Public Transit Fare OR Commercial Purifier Price - DIY CR Box Parts Cost",
      assumptions: [
        "Average 4-wheeler running cost: ₹9.0/km (petrol at ₹96/L, 12 km/L average urban stop-and-go efficiency).",
        "DIY Corsi-Rosenthal Box total build cost: ~₹3,200 vs commercial branded HEPA purifier (250 CADR): ₹14,500."
      ],
      scientificSources: [
        {
          title: "UC Davis / Corsi-Rosenthal Air Cleaner Performance Evaluation (2021)",
          citation: "Prather, K., Corsi, R., & Rosenthal, J. Cost-effectiveness and CADR benchmarking of DIY air filtration."
        }
      ]
    }
  ];
}
