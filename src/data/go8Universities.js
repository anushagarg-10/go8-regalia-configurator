/**
 * Seed data: Group of Eight (Go8) Australian university academic dress.
 *
 * Sources: official university academic dress regulations and established
 * regalia suppliers (George H Lilley, Churchill Gowns, GFP Graduations,
 * GownTown), cross-checked across multiple sources as of research date.
 *
 * IMPORTANT CAVEATS BEFORE USING THIS AS PRODUCTION DATA:
 * - Several universities (Sydney, Adelaide, UNSW) vary hood colour by
 *   FACULTY, not just degree level. The values below use one representative
 *   faculty/degree per university for a clean MVP, not the full official
 *   list. This is clearly flagged per entry.
 * - Always link back to the university's own official academic dress page
 *   in the UI (included below) so nothing here is presented as more
 *   authoritative than the source it came from.
 * - Treat this as "good enough for a portfolio project," not as something
 *   a real user should rely on to order real regalia.
 */

export const universities = [
  {
    id: "anu",
    name: "The Australian National University",
    shortName: "ANU",
    location: "Canberra, ACT",
    officialSource: "https://www.anu.edu.au",
    bachelor: {
      gownColor: "black",
      gownStyle: "standard",
      hoodBaseColor: "black",
      hoodAccentColor: "college-or-discipline-colour", // varies; not faculty-uniform
      capStyle: "trencher",
      capColor: "black",
      notes: "Hood is black, edged or lined with the graduate's college or discipline colour (varies).",
    },
    phd: {
      gownColor: "smalt-blue", // ANU's distinctive PhD colour, historically called "smalt" blue
      gownStyle: "cambridge",
      hoodBaseColor: "smalt-blue",
      hoodAccentColor: "smalt-blue",
      capStyle: "bonnet",
      capColor: "black-velvet",
      capCordColor: "smalt-blue",
      notes: "ANU's PhD blue is unique to the university; hood fully lined in matching colour.",
    },
  },
  {
    id: "usyd",
    name: "The University of Sydney",
    shortName: "Sydney",
    location: "Camperdown, NSW",
    officialSource: "https://www.sydney.edu.au",
    bachelor: {
      gownColor: "black",
      gownStyle: "oxford-ba", // similar to Oxford/Cambridge BA style
      hoodBaseColor: "black",
      hoodAccentColor: "varies-by-faculty", // e.g. BA = white fur edge, Commerce = copper+white
      capStyle: "trencher",
      capColor: "black",
      notes:
        "REPRESENTATIVE EXAMPLE ONLY: hood colour varies significantly by faculty (e.g. Bachelor of Arts is edged in white fur; Bachelor of Commerce is edged in copper and white silk). Full official list has 20+ variants.",
    },
    phd: {
      gownColor: "black",
      gownStyle: "cambridge-ma-based",
      hoodBaseColor: "black",
      hoodAccentColor: "faculty-colour-15cm-facing",
      capStyle: "bonnet",
      capColor: "black-velvet",
      notes: "PhD gown is the master's-style gown faced to 15cm with faculty-coloured cloth.",
    },
  },
  {
    id: "unimelb",
    name: "The University of Melbourne",
    shortName: "Melbourne",
    location: "Parkville, VIC",
    officialSource: "https://www.unimelb.edu.au",
    bachelor: {
      gownColor: "black",
      gownStyle: "oxford-bachelors",
      hoodBaseColor: "black",
      hoodAccentColor: "varies-by-faculty",
      hoodBinding: "white", // bachelors only; masters have no binding
      capStyle: "none", // IMPORTANT: bachelors are NOT permitted to wear a mortarboard at the ceremony
      capColor: null,
      notes:
        "UNIQUE RULE: Melbourne does not permit bachelor graduates to wear a mortarboard at the ceremony itself (strictly enforced, including in official photography). Hood is black, lined in faculty colour, bound white on the lower edge.",
    },
    phd: {
      gownColor: "black",
      gownStyle: "oxford-masters-faced-scarlet",
      hoodBaseColor: "black",
      hoodAccentColor: "scarlet",
      capStyle: "bonnet",
      capColor: "black-velvet",
      capCordColor: "scarlet",
      notes: "PhD gown faced in scarlet; hood is black lined in scarlet.",
    },
  },
  {
    id: "uq",
    name: "The University of Queensland",
    shortName: "UQ",
    location: "St Lucia, QLD",
    officialSource: "https://www.uq.edu.au",
    bachelor: {
      gownColor: "black",
      gownStyle: "cambridge",
      hoodBaseColor: "black",
      hoodAccentColor: "white", // UQ simplified to level-based colour in 1998: white = all bachelor degrees
      capStyle: "trencher",
      capColor: "black",
      notes:
        "UQ uniquely colour-codes by DEGREE LEVEL rather than faculty since a 1998 reform: white (bachelor), royal blue (masters), maroon (professional doctorate), scarlet (PhD), gold (higher doctorate). Simplest, most consistent system of the Go8.",
    },
    phd: {
      gownColor: "black",
      gownStyle: "cambridge",
      hoodBaseColor: "black",
      hoodAccentColor: "scarlet",
      capStyle: "tudor-bonnet",
      capColor: "black",
      notes: "PhD hood colour is scarlet under UQ's level-based system.",
    },
  },
  {
    id: "uwa",
    name: "The University of Western Australia",
    shortName: "UWA",
    location: "Crawley, WA",
    officialSource: "https://www.uwa.edu.au",
    bachelor: {
      gownColor: "black",
      gownStyle: "cambridge",
      hoodBaseColor: "black",
      hoodAccentColor: "varies-by-degree",
      capStyle: "trencher",
      capColor: "black",
      notes: "Hood colour/trim varies by specific degree awarded.",
    },
    phd: {
      gownColor: "black",
      gownStyle: "cambridge-faced-scarlet-gold-braid",
      hoodBaseColor: "black",
      hoodAccentColor: "scarlet",
      capStyle: "bonnet",
      capColor: "black-velvet",
      capCordColor: "scarlet",
      notes: "PhD gown has scarlet facings edged with gold braid; hood is black lined with scarlet.",
    },
  },
  {
    id: "adelaide",
    name: "The University of Adelaide",
    shortName: "Adelaide",
    location: "Adelaide, SA",
    officialSource: "https://www.adelaide.edu.au",
    bachelor: {
      gownColor: "black",
      gownStyle: "cambridge",
      hoodBaseColor: "black",
      hoodAccentColor: "eosin-pink", // representative example: Health & Medical Sciences faculty
      capStyle: "trencher",
      capColor: "black",
      notes:
        "REPRESENTATIVE EXAMPLE ONLY (Health & Medical Sciences faculty = Eosin Pink). Adelaide's hood colour varies by faculty grouping (Society/Culture/Education, Creative Arts & Science, Natural & Physical Sciences, Health & Medical Sciences, etc.), each with its own colour.",
    },
    phd: {
      gownColor: "black",
      gownStyle: "cambridge",
      hoodBaseColor: "black",
      hoodAccentColor: "phd-colour", // specific PhD hood colour, gold-tassel bonnet confirmed
      capStyle: "bonnet",
      capColor: "black-velvet",
      capCordColor: "gold",
      notes: "PhD bonnet has a gold tassel.",
    },
  },
  {
    id: "monash",
    name: "Monash University",
    shortName: "Monash",
    location: "Clayton, VIC",
    officialSource: "https://www.monash.edu",
    bachelor: {
      gownColor: "black",
      gownStyle: "cambridge",
      hoodBaseColor: "turquoise", // Monash's distinctive, unique base hood colour
      hoodAccentColor: "varies-by-faculty",
      capStyle: "trencher",
      capColor: "black",
      notes:
        "VISUALLY DISTINCTIVE: Monash hoods use a turquoise base fabric unique to Monash graduates, part-lined and edged in faculty colour for bachelors (fully lined for masters). Good candidate for a strong visual contrast against the other seven universities in the 3D viewer.",
    },
    phd: {
      gownColor: "black",
      gownStyle: "cambridge-faced-peony-red",
      hoodBaseColor: "turquoise",
      hoodAccentColor: "peony-red",
      capStyle: "bonnet",
      capColor: "black-velvet",
      capCordColor: "peony-red",
      notes: "PhD gown has peony red facings; turquoise hood fully lined in peony red, edged in faculty colour.",
    },
  },
  {
    id: "unsw",
    name: "UNSW Sydney",
    shortName: "UNSW",
    location: "Kensington, NSW",
    officialSource: "https://www.unsw.edu.au",
    bachelor: {
      gownColor: "black",
      gownStyle: "cambridge",
      hoodBaseColor: "old-gold", // UNSW's distinctive base hood colour for bachelors
      hoodAccentColor: "varies-by-faculty",
      capStyle: "trencher",
      capColor: "black",
      notes:
        "VISUALLY DISTINCTIVE: UNSW bachelor hoods use an 'old gold' base, partially lined (10cm) in faculty colour. Exception: COFA (art & design) and ADFA hoods use a black base instead of old gold.",
    },
    phd: {
      gownColor: "black",
      gownStyle: "robe-trimmed-gold",
      hoodBaseColor: "old-gold",
      hoodAccentColor: "gold",
      capStyle: "tudor-bonnet",
      capColor: "black",
      capCordColor: "gold",
      notes: "Doctoral robe trimmed with gold lace; black Tudor bonnet with gold lace and tassel.",
    },
  },
];

/**
 * Approximate hex values for the named colours above, for actual 3D
 * material rendering. These are reasonable approximations for a
 * portfolio project, not colour-matched to official pantone specs.
 */
export const colorHexMap = {
  black: "#1a1a1a",
  "black-velvet": "#0d0d0d",
  "old-gold": "#cfa338",
  turquoise: "#40b5ad",
  "smalt-blue": "#1a3f8a",
  scarlet: "#c8102e",
  "peony-red": "#c73e5c",
  "eosin-pink": "#f28fb0",
  white: "#f5f5f5",
  gold: "#d4af37",
  maroon: "#5c1a1a",
  "royal-blue": "#2643a3",
};
