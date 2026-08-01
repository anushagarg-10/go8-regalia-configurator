/**
 * Type declarations for the seed data file (go8Universities.js).
 * The .js file is imported as-is per the project brief; these types
 * describe its shape for the rest of the TypeScript codebase.
 */

export interface RegaliaDressConfig {
  gownColor: string;
  gownStyle: string;
  hoodBaseColor: string;
  hoodAccentColor: string;
  /** Only present where a university binds the hood edge (e.g. Melbourne bachelors). */
  hoodBinding?: string;
  /** "trencher" | "bonnet" | "tudor-bonnet" | "none" — kept as string in the data. */
  capStyle: string;
  capColor: string | null;
  capCordColor?: string;
  notes: string;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  location: string;
  officialSource: string;
  bachelor: RegaliaDressConfig;
  phd: RegaliaDressConfig;
}

export declare const universities: University[];
export declare const colorHexMap: Record<string, string>;
