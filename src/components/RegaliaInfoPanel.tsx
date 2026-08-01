"use client";

import { DEGREE_LEVEL_LABELS, type RegaliaView, type ResolvedColor } from "@/lib/regalia";

function ColorSwatch({ label, color }: { label: string; color: ResolvedColor }) {
  return (
    <li className="flex items-center gap-2">
      <span
        aria-hidden
        className="inline-block h-4 w-4 shrink-0 rounded-full border border-black/20 dark:border-white/20"
        style={{ backgroundColor: color.hex }}
      />
      <span className="text-sm text-zinc-700 dark:text-zinc-300">
        <span className="font-medium">{label}:</span>{" "}
        {color.mapped ? color.name.replace(/-/g, " ") : "varies (shown as placeholder)"}
      </span>
    </li>
  );
}

export default function RegaliaInfoPanel({ view }: { view: RegaliaView }) {
  return (
    <section
      aria-label="Regalia details"
      className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {view.university.name}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {DEGREE_LEVEL_LABELS[view.degreeLevel]} regalia · {view.university.location}
        </p>
      </div>

      <ul className="space-y-1.5">
        <ColorSwatch label="Gown" color={view.gown.color} />
        <ColorSwatch label="Hood base" color={view.hood.base} />
        <ColorSwatch label="Hood accent" color={view.hood.accent} />
        {view.hood.binding && <ColorSwatch label="Hood binding" color={view.hood.binding} />}
        {view.cap ? (
          <ColorSwatch label={`Cap (${view.cap.style.replace(/-/g, " ")})`} color={view.cap.color} />
        ) : (
          <li className="text-sm text-zinc-700 dark:text-zinc-300">
            <span className="font-medium">Cap:</span> none worn at the ceremony
          </li>
        )}
        {view.cap?.cord && <ColorSwatch label="Cap cord/tassel" color={view.cap.cord} />}
      </ul>

      {view.hasUnmappedColors && (
        <p
          role="note"
          className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200"
        >
          Some colours for this selection vary by faculty or discipline and are shown as a
          neutral grey placeholder. Check the official source below for your exact colours.
        </p>
      )}

      <p className="rounded-lg bg-zinc-100 p-3 text-sm leading-relaxed text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
        {view.notes}
      </p>

      <a
        href={view.university.officialSource}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
      >
        Official academic dress information ↗
      </a>

      <p className="text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">
        Colours are approximations for a portfolio demo, sourced from university regulations
        and regalia suppliers. Always confirm with your university before ordering regalia.
      </p>
    </section>
  );
}
