"use client";

import {
  FINISHES,
  MANNEQUIN_BUILDS,
  type MannequinConfig,
} from "@/lib/mannequin";

interface MannequinSelectorProps {
  config: MannequinConfig;
  onChange: (config: MannequinConfig) => void;
}

export default function MannequinSelector({ config, onChange }: MannequinSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
        Mannequin
      </legend>
      <div className="flex items-center gap-3">
        <div role="group" className="grid flex-1 grid-cols-2 rounded-full border border-ink/10 bg-white p-1">
          {MANNEQUIN_BUILDS.map((build) => {
            const selected = build.id === config.build;
            return (
              <button
                key={build.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange({ ...config, build: build.id })}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                  selected ? "bg-maroon text-cream shadow-sm" : "text-ink-soft hover:text-maroon"
                }`}
              >
                {build.label}
              </button>
            );
          })}
        </div>
        <div role="group" aria-label="Mannequin finish" className="flex items-center gap-1.5">
          {FINISHES.map((finish) => {
            const selected = finish.hex === config.finish;
            return (
              <button
                key={finish.hex}
                type="button"
                aria-label={`${finish.name} finish`}
                aria-pressed={selected}
                onClick={() => onChange({ ...config, finish: finish.hex })}
                className={`h-6 w-6 rounded-full border transition-transform ${
                  selected
                    ? "scale-110 border-maroon ring-2 ring-maroon/40"
                    : "border-ink/20 hover:scale-105"
                }`}
                style={{ backgroundColor: finish.hex }}
              />
            );
          })}
        </div>
      </div>
    </fieldset>
  );
}
