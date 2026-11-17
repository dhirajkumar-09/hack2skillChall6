import { describe, it, expect } from "vitest";
import { generateDailyPlan } from "../src/lib/llm-provider";
import { DEMO_PERSONAS } from "../src/lib/personas";
import { FALLBACK_AQI_DATA } from "../src/lib/aqi-service";

describe("Prompt Schema & GenAI Output Validation", () => {
  it("generates a structured daily plan that strictly adheres to the JSON schema", async () => {
    const profile = DEMO_PERSONAS.family_toddler;
    const plan = await generateDailyPlan(profile, FALLBACK_AQI_DATA, "en");

    // Root properties
    expect(plan).toHaveProperty("headline");
    expect(plan).toHaveProperty("generalAdvice");
    expect(plan).toHaveProperty("maskRecommendation");
    expect(plan).toHaveProperty("blocks");
    expect(plan).toHaveProperty("childrenOutdoorAdvice");
    expect(plan).toHaveProperty("ventilationStrategy");
    expect(plan).toHaveProperty("citations");

    // Mask protocol
    expect(plan.maskRecommendation).toHaveProperty("recommended");
    expect(plan.maskRecommendation).toHaveProperty("type");
    expect(plan.maskRecommendation).toHaveProperty("when");
    expect(plan.maskRecommendation).toHaveProperty("fitTip");

    // Action blocks
    expect(plan.blocks.length).toBeGreaterThanOrEqual(4);
    plan.blocks.forEach(block => {
      expect(block).toHaveProperty("id");
      expect(block).toHaveProperty("title");
      expect(block).toHaveProperty("timeRange");
      expect(block).toHaveProperty("period");
      expect(block).toHaveProperty("action");
      expect(block).toHaveProperty("why");
      expect(block).toHaveProperty("impact");
      expect(block.impact).toHaveProperty("pm25AvoidedUg");
      expect(block.impact).toHaveProperty("cigarettesAvoided");
      expect(block.impact).toHaveProperty("co2eSavedKg");
      expect(block.impact).toHaveProperty("moneySavedInr");
    });

    // Citations
    expect(plan.citations.length).toBeGreaterThan(0);
    expect(plan.citations[0]).toContain("WHO");
  });

  it("generates bilingual Hindi plan with matching structure", async () => {
    const profile = DEMO_PERSONAS.elderly_frugal;
    const plan = await generateDailyPlan(profile, FALLBACK_AQI_DATA, "hi");

    expect(plan.headline).toContain("वायु");
    expect(plan.maskRecommendation.type).toBeDefined();
    expect(plan.blocks.length).toBeGreaterThanOrEqual(4);
  });
});
