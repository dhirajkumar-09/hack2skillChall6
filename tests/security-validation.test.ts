import { describe, it, expect } from "vitest";

describe("Security Validation & Input Sanitization Guardrails", () => {
  it("rejects invalid coordinate inputs outside geographic bounds", () => {
    const isCoordinateValid = (lat: number, lon: number) => {
      return !isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
    };

    expect(isCoordinateValid(28.6139, 77.2090)).toBe(true);
    expect(isCoordinateValid(91, 50)).toBe(false);
    expect(isCoordinateValid(-95, 50)).toBe(false);
    expect(isCoordinateValid(25, 185)).toBe(false);
    expect(isCoordinateValid(NaN, 50)).toBe(false);
  });

  it("sanitizes city lookup queries against script injection", () => {
    const sanitizeCity = (raw: string) => {
      return raw.replace(/[^a-zA-Z0-9\s,.-]/g, "").trim().slice(0, 60);
    };

    expect(sanitizeCity("Patna")).toBe("Patna");
    expect(sanitizeCity("<script>alert('hack')</script>Patna")).toBe("scriptalerthackscriptPatna");
    expect(sanitizeCity("New Delhi (South Ext), India")).toBe("New Delhi South Ext, India");
  });

  it("enforces safe message length constraints for chat requests", () => {
    const MAX_QUERY_LEN = 1000;
    const cleanUserQuery = (input: unknown): string => {
      if (typeof input !== "string") return "";
      return input.trim().slice(0, MAX_QUERY_LEN);
    };

    const normal = "Can my 4 year old child play outside today?";
    expect(cleanUserQuery(normal)).toBe(normal);

    const oversized = "A".repeat(2500);
    expect(cleanUserQuery(oversized).length).toBe(MAX_QUERY_LEN);

    expect(cleanUserQuery(null)).toBe("");
    expect(cleanUserQuery(undefined)).toBe("");
    expect(cleanUserQuery(12345)).toBe("");
  });
});
