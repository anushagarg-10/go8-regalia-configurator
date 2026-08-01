/**
 * Supplemental seed data: FACULTY/DEGREE-specific hood colours for the Go8.
 *
 * Researched 2026-08-01 from official academic-dress regulations where
 * fetchable (UNSW regulations PDF, UWA policy library Schedule A, Monash
 * academic dress page, ANU regalia page, UQ's 1998 announcement) and the
 * universities' own regalia suppliers/estores otherwise. Lists cover the
 * most common faculties/degrees, not every award; hex values approximate
 * named silk colours.
 *
 * UQ is intentionally empty: it abolished faculty colours in 1998 in favour
 * of a level-based scheme, so its hood colours never vary by faculty.
 */

type Level = "bachelor" | "masters" | "phd";

export interface FacultyColorEntry {
  id: string;
  label: string;
  colorName: string;
  hex: string;
  /** Some faculties also change the hood base (e.g. UNSW ADA/ADFA jet black). */
  baseColorName?: string;
  baseHex?: string;
}

export interface FacultyColorSet {
  /** Degree levels whose varying hood slot this mapping fills. */
  appliesTo: Level[];
  source: string;
  note: string;
  faculties: FacultyColorEntry[];
}

export const facultyColors: Record<string, FacultyColorSet> = {
  anu: {
    appliesTo: ["bachelor", "masters"],
    source: "https://www.anu.edu.au/students/graduation/academic-regalia",
    note: "Colour set by ANU College; bachelor hoods half-lined, masters fully lined in the same colour. List not exhaustive.",
    faculties: [
      { id: "arts-social-sciences", label: "Arts & Social Sciences", colorName: "union-jack-blue", hex: "#012169" },
      { id: "asia-pacific", label: "Asia & the Pacific", colorName: "terracotta", hex: "#e2725b" },
      { id: "business-economics", label: "Business & Economics", colorName: "gold", hex: "#d4af37" },
      { id: "systems-society", label: "Systems & Society (formerly Engineering & CS)", colorName: "claret", hex: "#7f1734" },
      { id: "law-governance-policy", label: "Law, Governance & Policy", colorName: "purple", hex: "#6a0dad" },
      { id: "science-medicine", label: "Science & Medicine", colorName: "green", hex: "#046a38" },
      { id: "medicine-health-studies", label: "Medicine & Health Studies", colorName: "turquoise", hex: "#30c4bd" },
      { id: "multidisciplinary", label: "University-wide / Multidisciplinary", colorName: "white", hex: "#ffffff" },
    ],
  },
  usyd: {
    appliesTo: ["bachelor"],
    source: "https://alumni.sydneyestore.com.au/shop/category/graduation-regalia-hoods---bachelor",
    note: "Sydney specifies hoods per degree, not faculty; masters hoods are separate garments, so this mapping is bachelor-only. List not exhaustive (20+ variants exist).",
    faculties: [
      { id: "arts", label: "Arts (BA)", colorName: "white-fur", hex: "#f5f5f0" },
      { id: "science", label: "Science (BSc)", colorName: "amber", hex: "#ffbf00" },
      { id: "commerce", label: "Commerce (BCom)", colorName: "copper-and-white", hex: "#b87333" },
      { id: "economics", label: "Economics (BEc)", colorName: "copper", hex: "#b87333" },
      { id: "law", label: "Law (LLB)", colorName: "blue", hex: "#2a52be" },
      { id: "engineering", label: "Engineering (BE)", colorName: "light-maroon", hex: "#9e4244" },
      { id: "medicine", label: "Medicine (MB/MBBS)", colorName: "purple", hex: "#6a0dad" },
      { id: "education", label: "Education (BEd)", colorName: "white", hex: "#ffffff" },
      { id: "nursing", label: "Nursing (BN)", colorName: "white-with-turquoise-edge", hex: "#40e0d0" },
      { id: "music", label: "Music (BMus)", colorName: "buttercup-with-red-edge", hex: "#f9d71c" },
    ],
  },
  unimelb: {
    appliesTo: ["bachelor", "masters"],
    source: "https://www.ghlilley.com.au/products/university-of-melbourne-bachelor-graduation-gown-set",
    note: "Black hood lined in the faculty colour for bachelors (bound white) and masters (no binding). List not exhaustive.",
    faculties: [
      { id: "arts", label: "Arts", colorName: "stewart-blue", hex: "#3b5aa9" },
      { id: "commerce", label: "Commerce / Business & Economics", colorName: "sky-blue", hex: "#87ceeb" },
      { id: "law", label: "Law", colorName: "white", hex: "#ffffff" },
      { id: "engineering", label: "Engineering & IT", colorName: "gold", hex: "#d4af37" },
      { id: "science", label: "Science", colorName: "olive-green", hex: "#6b8e23" },
      { id: "medicine", label: "Medicine", colorName: "cardinal-red", hex: "#c41e3a" },
      { id: "education", label: "Education", colorName: "malachite-green", hex: "#0bda51" },
      { id: "music", label: "Music", colorName: "lilac", hex: "#c8a2c8" },
      { id: "architecture", label: "Architecture", colorName: "magenta", hex: "#c71585" },
    ],
  },
  uq: {
    appliesTo: [],
    source: "https://news.uq.edu.au/1998-10-14-uq-streamlines-academic-dress-colours",
    note: "UQ abolished faculty hood colours in 1998; colours are set by degree level only (white bachelors, royal blue masters, scarlet PhD).",
    faculties: [],
  },
  uwa: {
    appliesTo: ["bachelor"],
    source: "https://www.uwa.edu.au/policy/-/media/project/uwa/uwa/policy-library/policy/student-administration/graduation-academic-dress/schedule-a-graduation-academic-dress.docx",
    note: "UWA prescribes a silk lining colour per specific degree in Schedule A; bachelor pass hoods are edged white, honours gold. Common awards only, not the full schedule.",
    faculties: [
      { id: "bachelor-of-arts", label: "Bachelor of Arts (BA)", colorName: "royal-blue", hex: "#4169e1" },
      { id: "bachelor-of-science", label: "Bachelor of Science (BSc)", colorName: "emerald-green", hex: "#40b57f" },
      { id: "bachelor-of-commerce", label: "Commerce / Business / Economics", colorName: "flamingo", hex: "#f2789a" },
      { id: "bachelor-of-engineering", label: "Engineering (Hons)", colorName: "gold", hex: "#d4af37" },
      { id: "bachelor-of-laws", label: "Law (LLB) / Juris Doctor", colorName: "royal-purple", hex: "#7851a9" },
      { id: "medicine-mbbs-md", label: "Medicine (MBBS/MD)", colorName: "ruby", hex: "#9b1c31" },
      { id: "bachelor-of-biomedical-science", label: "Biomedical Science", colorName: "rose-pink", hex: "#ef8fa8" },
      { id: "bachelor-of-music", label: "Music", colorName: "peacock-blue", hex: "#00636f" },
      { id: "bachelor-of-philosophy", label: "Philosophy (Hons)", colorName: "scarlet", hex: "#c8102e" },
      { id: "bachelor-of-design", label: "Design", colorName: "terracotta", hex: "#e2725b" },
    ],
  },
  adelaide: {
    appliesTo: ["bachelor"],
    source: "https://shop.gfpgraduations.com.au/collections/adelaide-university/academic-dress",
    note: "Legacy University of Adelaide faculty-grouping colours via GFP Graduations, the university's official regalia partner. Masters follow a level-based colour instead. List may not be exhaustive.",
    faculties: [
      { id: "health-medical-sciences", label: "Health & Medical Sciences", colorName: "eosin-pink", hex: "#ef5b9a" },
      { id: "society-culture-education", label: "Society, Culture & Education", colorName: "pale-violet-grey", hex: "#c5c0d3" },
      { id: "business", label: "Business", colorName: "helvetia-blue", hex: "#2360a5" },
      { id: "creative-arts-science", label: "Creative Arts & Science", colorName: "cendre-green", hex: "#7bb661" },
      { id: "engineering-it", label: "Engineering & IT", colorName: "true-purple", hex: "#5f2d91" },
      { id: "natural-physical-sciences", label: "Natural & Physical Sciences", colorName: "primuline-yellow", hex: "#eec900" },
    ],
  },
  monash: {
    appliesTo: ["bachelor", "masters"],
    source: "https://www.monash.edu/students/admin/graduations/guides/academic-dress",
    note: "Turquoise hood base always; the faculty colour edges bachelor hoods and lines masters hoods. Double degrees wear the managing faculty's colour.",
    faculties: [
      { id: "art-design-architecture", label: "Art, Design and Architecture", colorName: "spectrum-orange", hex: "#f47b20" },
      { id: "arts", label: "Arts", colorName: "old-rose", hex: "#c08081" },
      { id: "business-economics", label: "Business and Economics", colorName: "peacock-green", hex: "#00a28a" },
      { id: "education", label: "Education", colorName: "banana", hex: "#ffe135" },
      { id: "engineering", label: "Engineering", colorName: "rose-beige", hex: "#c9a38d" },
      { id: "information-technology", label: "Information Technology", colorName: "spectrum-green", hex: "#00a651" },
      { id: "law", label: "Law", colorName: "white", hex: "#ffffff" },
      { id: "medicine-nursing-health-sciences", label: "Medicine, Nursing and Health Sciences", colorName: "victrix-blue", hex: "#2b4b9b" },
      { id: "pharmacy-pharmaceutical-sciences", label: "Pharmacy and Pharmaceutical Sciences", colorName: "buttercup", hex: "#fae03c" },
      { id: "science", label: "Science", colorName: "primrose", hex: "#f6d155" },
    ],
  },
  unsw: {
    appliesTo: ["bachelor", "masters"],
    source: "https://www.unsw.edu.au/content/dam/pdfs/student-communications/graduations/academic-dress-regulations.pdf",
    note: "Old gold hood base, edged (bachelor) or lined (masters) with the faculty colour, per the official regulations PDF. Arts, Design & Architecture and UNSW Canberra at ADFA use a jet black base instead.",
    faculties: [
      { id: "arts-design-architecture", label: "Arts, Design & Architecture", colorName: "turquoise-green", hex: "#6fcfbe", baseColorName: "jet-black", baseHex: "#141414" },
      { id: "business", label: "UNSW Business School", colorName: "cream", hex: "#f2ecd8" },
      { id: "engineering", label: "Engineering", colorName: "claret", hex: "#7f1734" },
      { id: "law-justice", label: "Law & Justice", colorName: "victrix-blue", hex: "#2b4b9b" },
      { id: "medicine-health", label: "Medicine & Health", colorName: "imperial-purple", hex: "#6b21a8" },
      { id: "science", label: "Science", colorName: "maize", hex: "#fbec5d" },
      { id: "adfa", label: "UNSW Canberra at ADFA", colorName: "royal-purple", hex: "#7851a9", baseColorName: "jet-black", baseHex: "#141414" },
    ],
  },
};
