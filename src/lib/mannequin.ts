/**
 * Mannequin configuration for the 3D viewer: body build and finish.
 * Boutique-display style: a smooth, featureless figure in a single satin
 * finish, studio white by default, with skin-tone finishes available.
 * Client-side presentation state only; not part of the regalia data.
 */

export type MannequinBuild = "female" | "male";

export interface MannequinConfig {
  build: MannequinBuild;
  finish: string;
  /** Colour of the outfit worn under the gown (collar + legs below the hem). */
  outfit: string;
}

export const FINISHES: { name: string; hex: string }[] = [
  { name: "Studio white", hex: "#f2efe9" },
  { name: "Light", hex: "#f1d3bc" },
  { name: "Medium", hex: "#cf9f7a" },
  { name: "Tan", hex: "#a9714b" },
  { name: "Deep", hex: "#6f4a30" },
];

export const OUTFIT_COLORS: { name: string; hex: string }[] = [
  { name: "Charcoal", hex: "#3a3438" },
  { name: "Black", hex: "#26262b" },
  { name: "White", hex: "#f2f0ea" },
  { name: "Navy", hex: "#22335c" },
  { name: "Beige", hex: "#d9c7a7" },
  { name: "Wine red", hex: "#a02334" },
  { name: "Blush pink", hex: "#e5aebc" },
];

export const MANNEQUIN_BUILDS: { id: MannequinBuild; label: string }[] = [
  { id: "female", label: "Women's" },
  { id: "male", label: "Men's" },
];

export const DEFAULT_MANNEQUIN: MannequinConfig = {
  build: "female",
  finish: FINISHES[0].hex,
  outfit: OUTFIT_COLORS[0].hex,
};
