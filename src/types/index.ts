export type Sensitivity = 'asthma' | 'copd' | 'heart_condition' | 'allergies' | 'pregnancy' | 'none';
export type MemberRole = 'toddler' | 'child' | 'adult' | 'senior';

export interface HouseholdMember {
  id: string;
  name: string;
  role: MemberRole;
  age: number;
  sensitivities: Sensitivity[];
}

export type HomeType = 'apartment_sealed' | 'apartment_drafty' | 'independent_house' | 'slum_informal';
export type CookingFuel = 'induction_electric' | 'lpg_gas' | 'biomass_wood_coal';
export type HeatingMethod = 'electric_heat' | 'wood_coal_angithi' | 'none';
export type CommuteMode = 'metro_train' | 'bus' | 'two_wheeler' | 'car_ac' | 'walking_cycling';
export type BudgetLevel = 'low_frugal' | 'moderate' | 'flexible';
export type AppLanguage = 'en' | 'hi';

export interface UserProfile {
  id: string;
  name: string;
  locationName: string;
  latitude: number;
  longitude: number;
  householdSize: number;
  members: HouseholdMember[];
  homeType: HomeType;
  cookingFuel: CookingFuel;
  heatingMethod: HeatingMethod;
  commuteMode: CommuteMode;
  commuteDurationMinutes: number;
  budgetLevel: BudgetLevel;
  hasAirPurifier: boolean;
  language: AppLanguage;
}

export type AQICategory = 
  | 'Good' 
  | 'Moderate' 
  | 'Unhealthy for Sensitive Groups' 
  | 'Unhealthy' 
  | 'Very Unhealthy' 
  | 'Hazardous';

export type AQIStandard = 'cpcb' | 'epa';

export interface HourlyForecastItem {
  hour: string;
  aqi: number;
  cpcbAqi?: number;
  epaAqi?: number;
  category: AQICategory;
  pm25: number;
  pm10?: number;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  temperatureInversion?: boolean;
  condition: string;
  recommendation?: string;
}

export interface AQIData {
  aqi: number;
  cpcbAqi?: number;
  epaAqi?: number;
  category: AQICategory;
  primaryPollutant: 'PM2.5' | 'PM10' | 'NO2' | 'O3' | 'SO2' | 'CO';
  pm25: number;
  pm10: number;
  no2?: number;
  co?: number;
  o3?: number;
  so2?: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  surfacePressure?: number;
  visibilityKm?: number;
  sunrise?: string;
  sunset?: string;
  temperatureInversion: boolean;
  forecastHourly: HourlyForecastItem[];
  safeOutdoorWindows: Array<{
    start: string;
    end: string;
    aqi: number;
    condition: string;
  }>;
  safeVentilationWindows: Array<{
    start: string;
    end: string;
    note: string;
  }>;
  timestamp: string;
  source: string;
  isFallback: boolean;
  isCalibrated?: boolean;
  calibratedNote?: string;
}

export interface MemberRiskAssessment {
  memberId: string;
  name: string;
  role: MemberRole;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' | 'Critical';
  keyWarning: string;
  inhalationBaselineUg: number;
  cigaretteEquivDay: number;
}

export interface PlanActionBlock {
  id: string;
  title: string;
  timeRange: string;
  period: 'morning' | 'commute' | 'outdoor' | 'indoor' | 'evening' | 'sleep';
  action: string;
  why: string;
  impact: {
    pm25AvoidedUg: number;
    cigarettesAvoided: number;
    co2eSavedKg: number;
    moneySavedInr: number;
  };
  completed?: boolean;
}

export interface DailyCleanAirPlan {
  id: string;
  date: string;
  headline: string;
  generalAdvice: string;
  maskRecommendation: {
    recommended: boolean;
    type: 'None' | 'Cloth/Surgical (Very Limited)' | 'N95 / FFP2 / KN95' | 'P100 / Elastomeric';
    when: string;
    fitTip: string;
  };
  blocks: PlanActionBlock[];
  childrenOutdoorAdvice: string;
  ventilationStrategy: string;
  citations: string[];
}

export interface IndoorHack {
  id: string;
  title: string;
  category: 'sealing' | 'cleaning' | 'ventilation' | 'diy_purifier' | 'plants_facts';
  costEstimateInr: number;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  reductionPotentialPercent: number;
  description: string;
  steps: string[];
  materials?: string[];
  mythVsFact?: { myth: string; fact: string };
}

export interface SustainableSwap {
  id: string;
  category: 'commute' | 'cooking' | 'heating' | 'waste' | 'shopping';
  title: string;
  fromAction: string;
  toAction: string;
  costDifferenceInr: string;
  effort: 'Low' | 'Medium' | 'High';
  feasibilityScore: number;
  co2eMonthlyKg: number;
  pmMonthlyGrams: number;
  healthBenefit: string;
  rationale: string;
}

export interface ImpactBreakdown {
  label: string;
  value: string;
  unit: string;
  context: string;
  formula: string;
  assumptions: string[];
  scientificSources: Array<{ title: string; citation: string; url?: string }>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  dataGrounded?: {
    aqiUsed: number;
    locationUsed: string;
    profileContext: string;
    citations: string[];
  };
  suggestedFollowUps?: string[];
}

export interface CommunityGroup {
  id: string;
  name: string;
  type: 'neighborhood' | 'rwa' | 'school' | 'family';
  memberCount: number;
  currentChallenge: {
    title: string;
    description: string;
    targetActions: number;
    completedActions: number;
    co2AvoidedKg: number;
    pmAvoidedGrams: number;
    daysLeft: number;
  };
  leaderboard: Array<{
    rank: number;
    name: string;
    score: number;
    actionsDone: number;
  }>;
}
