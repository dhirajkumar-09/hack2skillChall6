import { describe, it, expect } from "vitest";
import { getTranslation, TRANSLATIONS } from "../src/lib/i18n";

describe("i18n Localization & Bilingual Dictionary Parity", () => {
  it("exports complete dictionaries for both English and Hindi", () => {
    expect(TRANSLATIONS).toHaveProperty("en");
    expect(TRANSLATIONS).toHaveProperty("hi");
  });

  it("ensures all navigation keys exist in both English and Hindi", () => {
    const enNav = Object.keys(TRANSLATIONS.en.nav);
    const hiNav = Object.keys(TRANSLATIONS.hi.nav);

    expect(enNav.length).toBeGreaterThanOrEqual(8);
    expect(hiNav.length).toBe(enNav.length);

    enNav.forEach(key => {
      expect(TRANSLATIONS.hi.nav).toHaveProperty(key);
      expect((TRANSLATIONS.hi.nav as Record<string, string>)[key].length).toBeGreaterThan(0);
    });
  });

  it("ensures major modules (aqi, plan, indoor, swaps, impact, chat, community, profile) are fully translated", () => {
    const modules: (keyof typeof TRANSLATIONS.en)[] = [
      "aqi", "plan", "indoor", "swaps", "impact", "chat", "community", "profile"
    ];

    modules.forEach(mod => {
      expect(TRANSLATIONS.hi).toHaveProperty(mod);
      const enKeys = Object.keys(TRANSLATIONS.en[mod]);
      enKeys.forEach(k => {
        expect(TRANSLATIONS.hi[mod]).toHaveProperty(k);
      });
    });
  });

  it("returns fallback English translation when requested language is invalid", () => {
    // @ts-expect-error - testing invalid language key fallback
    const t = getTranslation("fr");
    expect(t).toBeDefined();
    expect(t.nav.dashboard).toBe("Dashboard");
  });

  it("returns authentic Hindi translation when requested", () => {
    const t = getTranslation("hi");
    expect(t).toBeDefined();
    expect(t.nav.dashboard).toBe("डैशबोर्ड");
    expect(t.appName).toBe("स्मॉगशील्ड");
  });
});
