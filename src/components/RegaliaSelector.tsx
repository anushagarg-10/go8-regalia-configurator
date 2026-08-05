"use client";

import {
  DEGREE_LEVELS,
  DEGREE_LEVEL_LABELS,
  universityLogoUrl,
  type DegreeLevel,
  type UniversitySummary,
} from "@/lib/regalia";

interface RegaliaSelectorProps {
  universities: UniversitySummary[];
  selectedUniversityId: string;
  selectedLevel: DegreeLevel;
  onUniversityChange: (id: string) => void;
  onLevelChange: (level: DegreeLevel) => void;
}

export default function RegaliaSelector({
  universities,
  selectedUniversityId,
  selectedLevel,
  onUniversityChange,
  onLevelChange,
}: RegaliaSelectorProps) {
  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
          University
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {universities.map((university) => {
            const selected = university.id === selectedUniversityId;
            return (
              <button
                key={university.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onUniversityChange(university.id)}
                className={`flex items-center gap-2 rounded-xl border px-2.5 py-2.5 text-left transition-all ${
                  selected
                    ? "border-maroon bg-maroon text-cream shadow-md shadow-maroon/25"
                    : "border-ink/10 bg-white text-ink hover:-translate-y-px hover:border-maroon/40 hover:shadow-sm"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={universityLogoUrl(university.officialSource)}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  width={22}
                  height={22}
                  className="h-5.5 w-5.5 shrink-0 rounded bg-white object-contain p-px"
                />
                <span className="min-w-0">
                  <span className="block font-display text-sm font-bold">{university.shortName}</span>
                  <span
                    className={`block truncate text-[11px] ${selected ? "text-cream/75" : "text-ink-soft"}`}
                  >
                    {university.location}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
          Degree level
        </legend>
        <div
          role="group"
          className="grid grid-cols-3 rounded-full border border-ink/10 bg-white p-1"
        >
          {DEGREE_LEVELS.map((level) => {
            const selected = level === selectedLevel;
            return (
              <button
                key={level}
                type="button"
                aria-pressed={selected}
                onClick={() => onLevelChange(level)}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                  selected ? "bg-maroon text-cream shadow-sm" : "text-ink-soft hover:text-maroon"
                }`}
              >
                {DEGREE_LEVEL_LABELS[level]}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
