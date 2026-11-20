import { describe, it, expect } from "vitest";
import { 
  FALLBACK_AQI_DATA, 
  calibrateAQIData, 
  calculateBothAQI,
  calculateAQIFromPM25
} from "../src/lib/aqi-service";

describe("AQI Service - Telemetry, Calibration & Diurnal Forecasting", () => {
  it("provides fallback AQI data adhering strictly to AQIData interface", () => {
    expect(FALLBACK_AQI_DATA).toHaveProperty("aqi");
    expect(FALLBACK_AQI_DATA).toHaveProperty("category");
    expect(FALLBACK_AQI_DATA).toHaveProperty("pm25");
    expect(FALLBACK_AQI_DATA).toHaveProperty("pm10");
    expect(FALLBACK_AQI_DATA).toHaveProperty("forecastHourly");
    expect(FALLBACK_AQI_DATA.forecastHourly.length).toBeGreaterThanOrEqual(10);
    expect(FALLBACK_AQI_DATA).toHaveProperty("safeOutdoorWindows");
    expect(FALLBACK_AQI_DATA).toHaveProperty("safeVentilationWindows");
  });

  it("calibrates baseline telemetry accurately from a manual sensor reading", () => {
    const rawData = { ...FALLBACK_AQI_DATA, pm25: 140, aqi: 310 };
    const calibrated = calibrateAQIData(rawData, 182, "cpcb");

    expect(calibrated.pm25).toBe(182);
    expect(calibrated.isCalibrated).toBe(true);
    expect(calibrated.cpcbAqi).toBe(348);
    expect(calibrated.category).toBe("Very Unhealthy");
    expect(calibrated.forecastHourly.length).toBe(rawData.forecastHourly.length);
  });

  it("calculates dual AQI scales with accurate CPCB and EPA breakpoints", () => {
    // Test moderate PM2.5 = 45 µg/m³
    const res45 = calculateBothAQI(45);
    expect(res45.cpcbAqi).toBeGreaterThanOrEqual(51);
    expect(res45.cpcbAqi).toBeLessThanOrEqual(100);
    expect(res45.cpcbCategory).toBe("Moderate");

    // Test severe PM2.5 = 280 µg/m³
    const res280 = calculateBothAQI(280);
    expect(res280.cpcbCategory).toBe("Hazardous");
    expect(res280.cpcbAqi).toBeGreaterThanOrEqual(400);
    expect(res280.epaCategory).toBe("Hazardous");
  });

  it("properly detects morning temperature inversion within the diurnal forecast", () => {
    const morningHours = FALLBACK_AQI_DATA.forecastHourly.filter(h => 
      h.hour === "06:00" || h.hour === "08:00"
    );
    const afternoonHours = FALLBACK_AQI_DATA.forecastHourly.filter(h => 
      h.hour === "14:00"
    );

    expect(morningHours.length).toBeGreaterThan(0);
    expect(afternoonHours.length).toBeGreaterThan(0);

    morningHours.forEach(h => {
      expect(h.temperatureInversion).toBe(true);
      expect(h.pm25).toBeGreaterThan(afternoonHours[0].pm25);
    });
  });

  it("correctly handles dual-standard calculation for zero and ultra-low PM2.5", () => {
    const zeroReading = calculateAQIFromPM25(0, "cpcb");
    expect(zeroReading.aqi).toBe(0);
    expect(zeroReading.category).toBe("Good");

    const zeroEpa = calculateAQIFromPM25(0, "epa");
    expect(zeroEpa.aqi).toBe(0);
    expect(zeroEpa.category).toBe("Good");
  });

  it("correctly computes hazardous AQI for extreme winter smog episodes (PM2.5 > 350)", () => {
    const extreme = calculateAQIFromPM25(450, "cpcb");
    expect(extreme.category).toBe("Hazardous");
    expect(extreme.aqi).toBeGreaterThanOrEqual(450);
  });
});
