"use client";

import {
  DEGREE_LEVELS,
  DEGREE_LEVEL_LABELS,
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
        <legend className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
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
                className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                  selected
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                    : "border-zinc-300 bg-white text-zinc-800 hover:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                }`}
              >
                <span className="block text-sm font-semibold">{university.shortName}</span>
                <span
                  className={`block text-xs ${
                    selected ? "text-indigo-100" : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {university.location}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Degree level
        </legend>
        <div
          role="group"
          className="grid grid-cols-2 overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700"
        >
          {DEGREE_LEVELS.map((level) => {
            const selected = level === selectedLevel;
            return (
              <button
                key={level}
                type="button"
                aria-pressed={selected}
                onClick={() => onLevelChange(level)}
                className={`px-3 py-2 text-sm font-semibold transition-colors ${
                  selected
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-zinc-700 hover:bg-indigo-50 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
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
