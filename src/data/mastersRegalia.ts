import type { RegaliaDressConfig } from "@/data/go8Universities";

/**
 * Supplemental seed data: MASTERS (coursework) academic dress for the Go8.
 *
 * Researched 2026-08-01 from official university academic-dress regulations
 * where available, cross-checked against the universities' own regalia
 * suppliers (GH Lilley, GFP Graduations). Kept separate from
 * go8Universities.js, which is imported as-is per the project brief.
 *
 * Faculty-dependent colours are deliberately recorded as
 * "varies-by-faculty" rather than guessed; the UI renders these as a grey
 * placeholder with a warning.
 */

export interface MastersEntry extends RegaliaDressConfig {
  /** Best source found for this university's masters dress. */
  researchSource: string;
}

export const mastersRegalia: Record<string, MastersEntry> = {
  anu: {
    gownColor: "black",
    gownStyle: "masters-style-open-front",
    hoodBaseColor: "black",
    hoodAccentColor: "varies-by-faculty",
    capStyle: "trencher",
    capColor: "black",
    notes:
      "Black hood edged or lined in the ANU college or discipline colour, which varies by faculty (e.g. claret for Engineering and Computer Science, gold for Business and Economics, purple for Law). Confirmed via ANU's regalia maker.",
    researchSource: "https://www.ghlilley.com.au/products/anu-master-graduation-gown-set",
  },
  usyd: {
    gownColor: "black",
    gownStyle: "oxford-cambridge-ma-style",
    hoodBaseColor: "black",
    hoodAccentColor: "varies-by-faculty",
    capStyle: "trencher",
    capColor: "black",
    notes:
      "Masters wear a gown similar to the Oxford/Cambridge MA, a black cloth trencher, and a black silk hood fully lined in a colour specific to the degree (e.g. MA blue silk, MEd white silk), so the lining varies by degree and faculty.",
    researchSource: "https://www.sydney.edu.au",
  },
  unimelb: {
    gownColor: "black",
    gownStyle: "oxford-masters-style",
    hoodBaseColor: "black",
    hoodAccentColor: "varies-by-faculty",
    capStyle: "trencher",
    capColor: "black",
    notes:
      "Black Oxford masters gown with a black hood fully lined in the award colour, varying by faculty (e.g. Stewart blue for Arts, white for Law, gold for Engineering). Masters hoods have no white binding; that marks bachelors. Unlike Melbourne bachelors, masters wear the trencher.",
    researchSource: "https://www.ghlilley.com.au/university-of-melbourne-academic-hood-for-masters-graduates",
  },
  uq: {
    gownColor: "black",
    gownStyle: "cambridge-masters-pattern",
    hoodBaseColor: "black",
    hoodAccentColor: "royal-blue",
    capStyle: "trencher",
    capColor: "black",
    notes:
      "Under UQ's level-based system, all masters hoods are black silk fully lined with royal/empire blue regardless of faculty, worn with a black Cambridge masters gown and black trencher, per UQ's official Academic Dress Requirements.",
    researchSource: "https://policies.uq.edu.au/download.php?associated=&id=6&version=2",
  },
  uwa: {
    gownColor: "black",
    gownStyle: "cambridge-style",
    hoodBaseColor: "black",
    hoodAccentColor: "varies-by-degree",
    capStyle: "trencher",
    capColor: "black",
    notes:
      "Black Cambridge-style gown, black trencher, and a black hood edged or lined with the degree colour, which varies by the specific degree awarded (per askUWA; UWA's supplier allocates the correct colour from the student record).",
    researchSource: "https://ipoint.uwa.edu.au/app/answers/detail/a_id/244",
  },
  adelaide: {
    gownColor: "black",
    gownStyle: "cambridge-style",
    hoodBaseColor: "black",
    hoodAccentColor: "south-east-limestone",
    capStyle: "trencher",
    capColor: "black",
    notes:
      "Adelaide's current level-based scheme dresses masters in a black Cambridge-style gown, black trencher, and a black Oxford-style hood fully lined with South East Limestone (a pale off-white), consistent across faculties, per the university's academic dress page.",
    researchSource: "https://www.adelaide.edu.au/student/graduations/academic-dress",
  },
  monash: {
    gownColor: "black",
    gownStyle: "masters-style",
    hoodBaseColor: "turquoise",
    hoodAccentColor: "varies-by-faculty",
    capStyle: "trencher",
    capColor: "black",
    notes:
      "Monash's distinctive turquoise hood, fully lined and edged in the faculty colour for masters (e.g. old rose for Arts, white for Law, primrose for Science), with black gown and black trencher. Confirmed via Monash's regalia suppliers.",
    researchSource: "https://www.ghlilley.com.au/products/monash-university-master-graduation-gown-set",
  },
  unsw: {
    gownColor: "black",
    gownStyle: "cambridge-ma-glove-sleeves",
    hoodBaseColor: "old-gold",
    hoodAccentColor: "varies-by-faculty",
    capStyle: "trencher",
    capColor: "black",
    notes:
      "Per UNSW's official academic dress regulations, the masters gown is black with closed glove sleeves, and the hood is old gold FULLY lined with the faculty colour (bachelors are only edged). Exception: Arts, Design and Architecture and ADFA use a jet black hood base. Black trencher.",
    researchSource: "https://www.unsw.edu.au/content/dam/pdfs/student-communications/graduations/academic-dress-regulations.pdf",
  },
};
