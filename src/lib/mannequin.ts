/**
 * Mannequin configuration for the 3D viewer: body build and skin tone.
 * Client-side presentation state only; not part of the regalia data.
 */

export type MannequinBuild = "female" | "male";

export interface MannequinConfig {
  build: MannequinBuild;
  skinTone: string;
}

export const SKIN_TONES: { name: string; hex: string }[] = [
  { name: "Light", hex: "#f1d3bc" },
  { name: "Medium", hex: "#cf9f7a" },
  { name: "Tan", hex: "#a9714b" },
  { name: "Deep", hex: "#6f4a30" },
];

export const MANNEQUIN_BUILDS: { id: MannequinBuild; label: string }[] = [
  { id: "female", label: "Women's" },
  { id: "male", label: "Men's" },
];

export const DEFAULT_MANNEQUIN: MannequinConfig = {
  build: "female",
  skinTone: SKIN_TONES[1].hex,
};
