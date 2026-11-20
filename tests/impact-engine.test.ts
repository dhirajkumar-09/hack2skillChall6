import { describe, it, expect } from "vitest";
import { 
  calculateAQIFromPM25, 
  calculateMemberRisk, 
  calculateRoomAirExchange, 
  calculateSwapImpact 
} from "../src/lib/impact-engine";
import { HouseholdMember } from "../src/types";

describe("Impact Engine - Deterministic Calculations", () => {
  it("converts PM2.5 to standard CPCB/EPA AQI correctly across breakpoints", () => {
    // Good (0-30 ug/m3 -> 0-50 AQI)
    expect(calculateAQIFromPM25(15).category).toBe("Good");
    expect(calculateAQIFromPM25(15).aqi).toBe(25);

    // Moderate (31-60 ug/m3 -> 51-100 AQI)
    expect(calculateAQIFromPM25(45).category).toBe("Moderate");

    // Unhealthy for Sensitive Groups (61-90 ug/m3 -> 101-200 AQI)
    expect(calculateAQIFromPM25(75).category).toBe("Unhealthy for Sensitive Groups");

    // Unhealthy (91-120 ug/m3 -> 201-300 AQI)
    expect(calculateAQIFromPM25(110).category).toBe("Unhealthy");

    // Very Unhealthy (121-250 ug/m3 -> 301-400 AQI)
    expect(calculateAQIFromPM25(200).category).toBe("Very Unhealthy");

    // Hazardous / Severe (250+ ug/m3 -> 401-500 AQI)
    const severe = calculateAQIFromPM25(350);
    expect(severe.category).toBe("Hazardous");
    expect(severe.aqi).toBeGreaterThanOrEqual(400);
  });

  it("accurately computes dual standard AQI for India CPCB NAQI vs US EPA / AccuWeather", () => {
    // Patna Mobile Screen test: PM2.5 = 182 µg/m³
    const cpcbPatna = calculateAQIFromPM25(182, "cpcb");
    const epaPatna = calculateAQIFromPM25(182, "epa");

    // India CPCB NAQI: 301 + (99/130)*(182 - 120) = 348
    expect(cpcbPatna.aqi).toBe(348);
    expect(cpcbPatna.cpcbAqi).toBe(348);
    expect(cpcbPatna.category).toBe("Very Unhealthy");

    // US EPA: 150.5 to 250.4 range -> 201 to 300 AQI bracket
    expect(epaPatna.epaAqi).toBe(232);
    expect(epaPatna.category).toBe("Very Unhealthy");

    // Delhi reading test: PM2.5 = 164.4 µg/m³ gives CPCB AQI 335
    const delhiAqi = calculateAQIFromPM25(164.4, "cpcb");
    expect(delhiAqi.aqi).toBe(335);
  });

  it("calculates member inhalation exposure and Berkeley Earth cigarette equivalence", () => {
    const toddler: HouseholdMember = {
      id: "t_1",
      name: "Baby Tara",
      role: "toddler",
      age: 2,
      sensitivities: ["allergies"]
    };

    // Ambient PM2.5 = 300 ug/m3 (Severe smog)
    const risk = calculateMemberRisk(toddler, 300, 100, 2);
    expect(risk.inhalationBaselineUg).toBeGreaterThan(0);
    expect(risk.cigaretteEquivDay).toBeGreaterThan(0);
    expect(risk.riskLevel).toBe("Critical");
    expect(risk.keyWarning).toContain("Severe smog alert");
  });

  it("computes room air changes (ACH) and Corsi-Rosenthal CADR adequacy", () => {
    // 14ft x 12ft room with 9ft ceiling = 1512 cu ft
    // With a 250 CFM Corsi-Rosenthal box fan:
    // ACH = (250 * 60) / 1512 = ~9.9 ACH
    const result = calculateRoomAirExchange(14, 12, 9, 250);
    expect(result.roomAreaSqFt).toBe(168);
    expect(result.roomVolumeCuFt).toBe(1512);
    expect(result.currentAch).toBeCloseTo(9.9, 0.5);
    expect(result.adequacyStatus).toBe("Sufficient");
  });

  it("computes commute mode emissions and cost savings", () => {
    // Solo car driver commuting 45 mins
    const impact = calculateSwapImpact("car_ac", 45, "none", 5);
    expect(impact.commuteSwap.monthlyCo2eAvoidedKg).toBeGreaterThan(50);
    expect(impact.commuteSwap.monthlyPm25AvoidedGrams).toBeGreaterThan(10);
    expect(impact.commuteSwap.monthlyMoneySavedInr).toBeGreaterThan(1000);
  });

  it("calculates senior with COPD risk profile accurately during hazardous smog", () => {
    const seniorMember: HouseholdMember = {
      id: "s_1",
      name: "Ramesh Sharma",
      role: "senior",
      age: 71,
      sensitivities: ["copd", "heart_condition"]
    };

    const assessment = calculateMemberRisk(seniorMember, 280, 80, 1.5);
    expect(assessment.riskLevel).toBe("Critical");
    expect(assessment.keyWarning).toContain("Severe smog alert");
    expect(assessment.cigaretteEquivDay).toBeGreaterThan(2);
  });

  it("identifies undersized room filtration when CADR delivers under 3.5 ACH", () => {
    // Large hall: 25ft x 20ft with 10ft ceiling = 5000 cu ft
    // Tiny air purifier with only 100 CFM:
    // ACH = (100 * 60) / 5000 = 1.2 ACH (< 3.5 ACH)
    const undersized = calculateRoomAirExchange(25, 20, 10, 100);
    expect(undersized.roomVolumeCuFt).toBe(5000);
    expect(undersized.currentAch).toBe(1.2);
    expect(undersized.adequacyStatus).toBe("Undersized");
    expect(undersized.recommendedCadrCfm).toBeGreaterThanOrEqual(400);
  });

  it("evaluates two-wheeler commute transition to electric metro", () => {
    const twoWheelerSwap = calculateSwapImpact("two_wheeler", 30, "wood_coal_angithi", 6);
    expect(twoWheelerSwap.commuteSwap.monthlyCo2eAvoidedKg).toBeGreaterThan(5);
    expect(twoWheelerSwap.commuteSwap.monthlyPm25AvoidedGrams).toBeGreaterThan(5);
    expect(twoWheelerSwap.heatingSwap.monthlyPmSavedGrams).toBeGreaterThan(1000);
  });

  it("evaluates low-exposure baseline for healthy indoor air below WHO limits", () => {
    const healthyAdult: HouseholdMember = {
      id: "a_1",
      name: "Ananya",
      role: "adult",
      age: 28,
      sensitivities: []
    };

    const cleanAir = calculateMemberRisk(healthyAdult, 15, 10, 1);
    expect(cleanAir.riskLevel).toBe("Low");
    expect(cleanAir.keyWarning).toContain("acceptable safety parameters");
  });
});
