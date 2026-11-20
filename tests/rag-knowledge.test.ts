import { describe, it, expect } from "vitest";
import { queryKnowledgeBase, KNOWLEDGE_BASE } from "../src/lib/rag-store";

describe("RAG Knowledge Store & Scientific Grounding", () => {
  it("indexes knowledge chunks covering WHO, CPCB, Masks, CR-Box, and Inversion", () => {
    expect(KNOWLEDGE_BASE.length).toBeGreaterThanOrEqual(5);

    const topics = KNOWLEDGE_BASE.map(c => c.topic);
    expect(topics).toContain("who_guidelines");
    expect(topics).toContain("aqi_scale");
    expect(topics).toContain("masks");
    expect(topics).toContain("diy_purifier");
    expect(topics).toContain("ventilation");
  });

  it("retrieves WHO guideline citations when querying safe thresholds", () => {
    const results = queryKnowledgeBase("WHO PM2.5 annual 24-hour limit safety benchmark", 2);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].source).toContain("WHO");
  });

  it("retrieves Corsi-Rosenthal Box specifications when querying DIY purifiers", () => {
    const results = queryKnowledgeBase("How to build a low cost Corsi Rosenthal box fan purifier", 2);
    expect(results.length).toBeGreaterThan(0);
    const content = results[0].content.toLowerCase();
    expect(content).toContain("corsi-rosenthal");
    expect(content).toContain("cadr");
  });

  it("retrieves evidence-based myth-debunking when querying houseplants for smog", () => {
    const results = queryKnowledgeBase("Do indoor snake plants or spider plants remove smog or PM2.5?", 2);
    expect(results.length).toBeGreaterThan(0);
    const text = results[0].content.toLowerCase();
    expect(text).toContain("plant");
    expect(results[0].source).toContain("Cummings & Waring");
  });

  it("returns fallback chunks gracefully for empty or gibberish queries", () => {
    const results = queryKnowledgeBase("xyz987qwe123gibberish", 2);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty("title");
    expect(results[0]).toHaveProperty("content");
  });
});
