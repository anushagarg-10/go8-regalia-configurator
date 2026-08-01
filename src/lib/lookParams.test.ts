import { describe, expect, it } from "vitest";
import { buildLookQuery, DEFAULT_LOOK, parseLookParams, type LookState } from "@/lib/lookParams";
import { FINISHES } from "@/lib/mannequin";

describe("parseLookParams", () => {
  it("round-trips a full look through the query string", () => {
    const look: LookState = {
      universityId: "monash",
      level: "masters",
      facultyId: "law",
      mannequin: { build: "male", finish: FINISHES[3].hex },
    };
    const query = buildLookQuery(look);
    expect(parseLookParams(query)).toEqual(look);
  });

  it("omits the faculty param when none is chosen", () => {
    const query = buildLookQuery(DEFAULT_LOOK);
    expect(query).not.toContain("faculty=");
    expect(parseLookParams(query)).toEqual(DEFAULT_LOOK);
  });

  it("falls back to defaults for invalid or missing values", () => {
    expect(parseLookParams("")).toEqual(DEFAULT_LOOK);
    const parsed = parseLookParams("uni=oxford&level=diploma&build=robot&finish=chrome");
    expect(parsed.universityId).toBe(DEFAULT_LOOK.universityId);
    expect(parsed.level).toBe(DEFAULT_LOOK.level);
    expect(parsed.mannequin).toEqual(DEFAULT_LOOK.mannequin);
  });

  it("keeps unvalidated faculty ids for the API to vet", () => {
    expect(parseLookParams("uni=anu&faculty=systems-society").facultyId).toBe("systems-society");
  });
});
