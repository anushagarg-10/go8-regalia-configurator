import {
  universities,
  colorHexMap,
  type University,
  type RegaliaDressConfig,
} from "@/data/go8Universities";
import { mastersRegalia } from "@/data/mastersRegalia";

export const DEGREE_LEVELS = ["bachelor", "masters", "phd"] as const;
export type DegreeLevel = (typeof DEGREE_LEVELS)[number];

export const DEGREE_LEVEL_LABELS: Record<DegreeLevel, string> = {
  bachelor: "Bachelor",
  masters: "Masters",
  phd: "PhD",
};

/**
 * Hex approximations for researched colours that appear only in the masters
 * supplement; the original seed colorHexMap is imported as-is and untouched.
 */
const SUPPLEMENTAL_HEX: Record<string, string> = {
  "south-east-limestone": "#e6dfcf",
};

/**
 * Colours in the seed data that have no hex mapping (e.g. "varies-by-faculty")
 * render as this neutral placeholder and are flagged `mapped: false` so the
 * UI can tell the user the real colour depends on their faculty/discipline.
 */
export const FALLBACK_HEX = "#9ca3af";

export interface ResolvedColor {
  /** Colour name as it appears in the seed data (or "unspecified"). */
  name: string;
  hex: string;
  /** False when the name has no entry in colorHexMap and the hex is a placeholder. */
  mapped: boolean;
}

export interface UniversitySummary {
  id: string;
  name: string;
  shortName: string;
  location: string;
  officialSource: string;
}

export interface RegaliaView {
  university: UniversitySummary;
  degreeLevel: DegreeLevel;
  gown: {
    style: string;
    color: ResolvedColor;
  };
  hood: {
    base: ResolvedColor;
    accent: ResolvedColor;
    binding?: ResolvedColor;
  };
  /** Null when the university's rules specify no cap for this level. */
  cap: {
    style: string;
    color: ResolvedColor;
    cord?: ResolvedColor;
  } | null;
  notes: string;
  /** True when any rendered colour is a placeholder (faculty-dependent). */
  hasUnmappedColors: boolean;
}

export function isDegreeLevel(value: unknown): value is DegreeLevel {
  return (
    typeof value === "string" && (DEGREE_LEVELS as readonly string[]).includes(value)
  );
}

export function resolveColor(name: string | null | undefined): ResolvedColor {
  if (!name) {
    return { name: "unspecified", hex: FALLBACK_HEX, mapped: false };
  }
  const hex = colorHexMap[name] ?? SUPPLEMENTAL_HEX[name];
  if (!hex) {
    return { name, hex: FALLBACK_HEX, mapped: false };
  }
  return { name, hex, mapped: true };
}

function toSummary(university: University): UniversitySummary {
  return {
    id: university.id,
    name: university.name,
    shortName: university.shortName,
    location: university.location,
    officialSource: university.officialSource,
  };
}

export function listUniversities(): UniversitySummary[] {
  return universities.map(toSummary);
}

export function getUniversityById(id: string | null | undefined): University | undefined {
  if (typeof id !== "string") return undefined;
  const normalized = id.trim().toLowerCase();
  return universities.find((u) => u.id === normalized);
}

export function getRegaliaView(
  universityId: string | null | undefined,
  level: DegreeLevel,
): RegaliaView | null {
  const university = getUniversityById(universityId);
  if (!university || !isDegreeLevel(level)) return null;

  const config: RegaliaDressConfig | undefined =
    level === "masters" ? mastersRegalia[university.id] : university[level];
  if (!config) return null;

  const gownColor = resolveColor(config.gownColor);
  const hoodBase = resolveColor(config.hoodBaseColor);
  const hoodAccent = resolveColor(config.hoodAccentColor);
  const hoodBinding = config.hoodBinding ? resolveColor(config.hoodBinding) : undefined;

  const hasCap = config.capStyle !== "none" && config.capColor !== null;
  const capColor = hasCap ? resolveColor(config.capColor) : undefined;
  const capCord = hasCap && config.capCordColor ? resolveColor(config.capCordColor) : undefined;

  const renderedColors = [gownColor, hoodBase, hoodAccent, hoodBinding, capColor, capCord];

  return {
    university: toSummary(university),
    degreeLevel: level,
    gown: {
      style: config.gownStyle,
      color: gownColor,
    },
    hood: {
      base: hoodBase,
      accent: hoodAccent,
      ...(hoodBinding ? { binding: hoodBinding } : {}),
    },
    cap:
      hasCap && capColor
        ? {
            style: config.capStyle,
            color: capColor,
            ...(capCord ? { cord: capCord } : {}),
          }
        : null,
    notes: config.notes,
    hasUnmappedColors: renderedColors.some((c) => c !== undefined && !c.mapped),
  };
}
