import { describe, expect, it } from "vitest";
import { slugify } from "../src/slug";

describe("slugify", () => {
  it("kebab-cases launch names", () => {
    expect(slugify("Falcon 9 Block 5 | Starlink Group 12-31")).toBe("falcon-9-block-5-starlink-group-12-31");
  });
  it("strips accents and symbols", () => {
    expect(slugify("Ariane 6 · Galiléo L14")).toBe("ariane-6-galileo-l14");
  });
  it("never leaves leading/trailing dashes", () => {
    expect(slugify("  --Starship!  ")).toBe("starship");
  });
});
