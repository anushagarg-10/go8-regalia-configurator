import { getUniversityById, isDegreeLevel, type DegreeLevel } from "@/lib/regalia";
import {
  DEFAULT_MANNEQUIN,
  FINISHES,
  MANNEQUIN_BUILDS,
  type MannequinConfig,
} from "@/lib/mannequin";

/**
 * A complete studio configuration, encodable to/from URL query params so
 * looks can be shared as links (e.g. /studio?uni=uq&level=masters&build=male).
 * Invalid or missing values fall back to defaults rather than erroring.
 */
export interface LookState {
  universityId: string;
  level: DegreeLevel;
  facultyId: string | null;
  mannequin: MannequinConfig;
}

export const DEFAULT_LOOK: LookState = {
  universityId: "anu",
  level: "bachelor",
  facultyId: null,
  mannequin: DEFAULT_MANNEQUIN,
};

function finishSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export function parseLookParams(search: string): LookState {
  const params = new URLSearchParams(search);

  const uni = params.get("uni");
  const universityId = getUniversityById(uni)?.id ?? DEFAULT_LOOK.universityId;

  const levelParam = params.get("level");
  const level = isDegreeLevel(levelParam) ? levelParam : DEFAULT_LOOK.level;

  const facultyId = params.get("faculty") || null;

  const buildParam = params.get("build");
  const build =
    MANNEQUIN_BUILDS.find((b) => b.id === buildParam)?.id ?? DEFAULT_MANNEQUIN.build;

  const finishParam = params.get("finish");
  const finish =
    FINISHES.find((f) => finishSlug(f.name) === finishParam)?.hex ?? DEFAULT_MANNEQUIN.finish;

  return { universityId, level, facultyId, mannequin: { build, finish } };
}

export function buildLookQuery(state: LookState): string {
  const params = new URLSearchParams();
  params.set("uni", state.universityId);
  params.set("level", state.level);
  if (state.facultyId) params.set("faculty", state.facultyId);
  params.set("build", state.mannequin.build);
  const finish = FINISHES.find((f) => f.hex === state.mannequin.finish);
  if (finish) params.set("finish", finishSlug(finish.name));
  return params.toString();
}
