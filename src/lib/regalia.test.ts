import { describe, expect, it } from "vitest";
import {
  DEGREE_LEVELS,
  FALLBACK_HEX,
  getRegaliaView,
  getUniversityById,
  isDegreeLevel,
  listFaculties,
  listUniversities,
  resolveColor,
  type DegreeLevel,
} from "@/lib/regalia";

const GO8_IDS = ["anu", "usyd", "unimelb", "uq", "uwa", "adelaide", "monash", "unsw"];

describe("listUniversities", () => {
  it("returns all eight Go8 universities with summary fields", () => {
    const list = listUniversities();
    expect(list).toHaveLength(8);
    expect(list.map((u) => u.id).sort()).toEqual([...GO8_IDS].sort());
    for (const u of list) {
      expect(u.name).toBeTruthy();
      expect(u.shortName).toBeTruthy();
      expect(u.location).toBeTruthy();
      expect(u.officialSource).toMatch(/^https:\/\//);
    }
  });
});

describe("getUniversityById", () => {
  it("finds a university by exact id", () => {
    expect(getUniversityById("monash")?.shortName).toBe("Monash");
  });

  it("normalizes case and whitespace", () => {
    expect(getUniversityById("  ANU ")?.id).toBe("anu");
  });

  it("returns undefined for unknown, empty, or non-string ids", () => {
    expect(getUniversityById("oxford")).toBeUndefined();
    expect(getUniversityById("")).toBeUndefined();
    expect(getUniversityById(null)).toBeUndefined();
    expect(getUniversityById(undefined)).toBeUndefined();
  });
});

describe("isDegreeLevel", () => {
  it("accepts only the supported levels", () => {
    expect(isDegreeLevel("bachelor")).toBe(true);
    expect(isDegreeLevel("masters")).toBe(true);
    expect(isDegreeLevel("phd")).toBe(true);
    expect(isDegreeLevel("diploma")).toBe(false);
    expect(isDegreeLevel("")).toBe(false);
    expect(isDegreeLevel(null)).toBe(false);
    expect(isDegreeLevel(42)).toBe(false);
  });
});

describe("resolveColor", () => {
  it("maps known colour names to hex", () => {
    expect(resolveColor("turquoise")).toEqual({
      name: "turquoise",
      hex: "#40b5ad",
      mapped: true,
    });
  });

  it("flags unknown colour names and falls back to the placeholder hex", () => {
    const resolved = resolveColor("varies-by-faculty");
    expect(resolved.mapped).toBe(false);
    expect(resolved.hex).toBe(FALLBACK_HEX);
    expect(resolved.name).toBe("varies-by-faculty");
  });

  it("handles null/undefined", () => {
    expect(resolveColor(null).mapped).toBe(false);
    expect(resolveColor(undefined).hex).toBe(FALLBACK_HEX);
  });
});

describe("getRegaliaView", () => {
  it("returns a complete view for every university and degree level", () => {
    for (const id of GO8_IDS) {
      for (const level of DEGREE_LEVELS) {
        const view = getRegaliaView(id, level);
        expect(view, `${id}/${level}`).not.toBeNull();
        expect(view?.university.id).toBe(id);
        expect(view?.degreeLevel).toBe(level);
        expect(view?.gown.color.hex).toMatch(/^#[0-9a-f]{6}$/i);
        expect(view?.hood.base.hex).toMatch(/^#[0-9a-f]{6}$/i);
        expect(view?.hood.accent.hex).toMatch(/^#[0-9a-f]{6}$/i);
        expect(view?.notes).toBeTruthy();
        expect(view?.university.officialSource).toMatch(/^https:\/\//);
      }
    }
  });

  it("resolves Monash bachelor's distinctive turquoise hood base", () => {
    const view = getRegaliaView("monash", "bachelor");
    expect(view?.hood.base).toEqual({ name: "turquoise", hex: "#40b5ad", mapped: true });
    expect(view?.gown.color.hex).toBe("#1a1a1a");
  });

  it("resolves the ANU PhD smalt-blue gown, bonnet, and cord", () => {
    const view = getRegaliaView("anu", "phd");
    expect(view?.gown.color).toEqual({ name: "smalt-blue", hex: "#1a3f8a", mapped: true });
    expect(view?.cap?.style).toBe("bonnet");
    expect(view?.cap?.color.hex).toBe("#0d0d0d");
    expect(view?.cap?.cord?.hex).toBe("#1a3f8a");
  });

  it("returns cap: null for Melbourne bachelors (no mortarboard rule) and keeps the hood binding", () => {
    const view = getRegaliaView("unimelb", "bachelor");
    expect(view?.cap).toBeNull();
    expect(view?.hood.binding?.hex).toBe("#f5f5f5");
    expect(view?.notes).toMatch(/mortarboard/i);
  });

  it("flags faculty-dependent colours instead of presenting them as universal", () => {
    const usyd = getRegaliaView("usyd", "bachelor");
    expect(usyd?.hood.accent.mapped).toBe(false);
    expect(usyd?.hood.accent.hex).toBe(FALLBACK_HEX);
    expect(usyd?.hasUnmappedColors).toBe(true);

    const uq = getRegaliaView("uq", "phd");
    expect(uq?.hasUnmappedColors).toBe(false);
  });

  it("returns null for unknown universities and invalid levels", () => {
    expect(getRegaliaView("oxford", "bachelor")).toBeNull();
    expect(getRegaliaView("", "phd")).toBeNull();
    expect(getRegaliaView(null, "bachelor")).toBeNull();
    expect(getRegaliaView("anu", "diploma" as DegreeLevel)).toBeNull();
  });

  it("lists researched faculties only where colours actually vary", () => {
    expect(listFaculties("anu", "bachelor").length).toBeGreaterThan(0);
    expect(listFaculties("monash", "masters").length).toBeGreaterThan(0);
    // UQ is level-based: no faculty variation at any level.
    expect(listFaculties("uq", "bachelor")).toHaveLength(0);
    // Sydney's degree-specific mapping is bachelor-only.
    expect(listFaculties("usyd", "phd")).toHaveLength(0);
    expect(listFaculties("oxford", "bachelor")).toHaveLength(0);
  });

  it("applies a chosen faculty's researched colour to the hood", () => {
    const anu = getRegaliaView("anu", "bachelor", "systems-society");
    expect(anu?.hood.accent).toEqual({ name: "claret", hex: "#7f1734", mapped: true });
    expect(anu?.hasUnmappedColors).toBe(false);
    expect(anu?.selectedFaculty?.label).toMatch(/Systems & Society/);

    // UNSW ADA swaps the hood base to jet black as well as setting the lining.
    const unsw = getRegaliaView("unsw", "bachelor", "arts-design-architecture");
    expect(unsw?.hood.base.name).toBe("jet-black");
    expect(unsw?.hood.accent.name).toBe("turquoise-green");

    // A faculty choice also overrides representative-example colours.
    const adelaide = getRegaliaView("adelaide", "bachelor", "business");
    expect(adelaide?.hood.accent.name).toBe("helvetia-blue");
  });

  it("ignores unknown faculty ids and keeps the placeholder", () => {
    const view = getRegaliaView("anu", "bachelor", "hogwarts");
    expect(view?.selectedFaculty).toBeUndefined();
    expect(view?.hood.accent.mapped).toBe(false);
    expect(view?.hasUnmappedColors).toBe(true);
  });

  it("resolves masters regalia from the researched supplement", () => {
    // UQ's level-based system: all masters hoods lined royal blue.
    const uq = getRegaliaView("uq", "masters");
    expect(uq?.hood.accent).toEqual({ name: "royal-blue", hex: "#2643a3", mapped: true });
    expect(uq?.cap?.style).toBe("trencher");
    expect(uq?.hasUnmappedColors).toBe(false);

    // Adelaide masters: limestone lining via the supplemental hex map.
    const adelaide = getRegaliaView("adelaide", "masters");
    expect(adelaide?.hood.accent.mapped).toBe(true);
    expect(adelaide?.hood.accent.hex).toBe("#e6dfcf");

    // Monash keeps its turquoise base; faculty lining stays flagged.
    const monash = getRegaliaView("monash", "masters");
    expect(monash?.hood.base.hex).toBe("#40b5ad");
    expect(monash?.hood.accent.mapped).toBe(false);
    expect(monash?.hasUnmappedColors).toBe(true);

    // Melbourne masters DO wear a trencher (unlike bachelors) and lose the white binding.
    const unimelb = getRegaliaView("unimelb", "masters");
    expect(unimelb?.cap?.style).toBe("trencher");
    expect(unimelb?.hood.binding).toBeUndefined();
  });
});
