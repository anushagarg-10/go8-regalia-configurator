"use client";

import { DEGREE_LEVEL_LABELS, type RegaliaView, type ResolvedColor } from "@/lib/regalia";

function ColorSwatch({ label, color }: { label: string; color: ResolvedColor }) {
  return (
    <li className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="inline-block h-4.5 w-4.5 shrink-0 rounded-full border border-ink/15 shadow-inner"
        style={{ backgroundColor: color.hex }}
      />
      <span className="text-sm text-ink">
        <span className="font-semibold">{label}:</span>{" "}
        <span className="text-ink-soft">
          {color.mapped ? color.name.replace(/-/g, " ") : "varies (shown as placeholder)"}
        </span>
      </span>
    </li>
  );
}

export default function RegaliaInfoPanel({ view }: { view: RegaliaView }) {
  return (
    <section
      aria-label="Regalia details"
      className="space-y-4 rounded-2xl border border-ink/10 bg-white p-5"
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-maroon">
          {DEGREE_LEVEL_LABELS[view.degreeLevel]} regalia
        </p>
        <h2 className="mt-1 font-display text-lg font-bold leading-snug text-ink">
          {view.university.name}
        </h2>
        <p className="text-xs text-ink-soft">
          {view.university.location}
          {view.selectedFaculty ? ` · ${view.selectedFaculty.label}` : ""}
        </p>
      </div>

      <ul className="space-y-2">
        <ColorSwatch label="Gown" color={view.gown.color} />
        <ColorSwatch label="Hood base" color={view.hood.base} />
        <ColorSwatch label="Hood accent" color={view.hood.accent} />
        {view.hood.binding && <ColorSwatch label="Hood binding" color={view.hood.binding} />}
        {view.cap ? (
          <ColorSwatch label={`Cap (${view.cap.style.replace(/-/g, " ")})`} color={view.cap.color} />
        ) : (
          <li className="text-sm text-ink">
            <span className="font-semibold">Cap:</span>{" "}
            <span className="text-ink-soft">none worn at the ceremony</span>
          </li>
        )}
        {view.cap?.cord && <ColorSwatch label="Cap cord/tassel" color={view.cap.cord} />}
      </ul>

      {view.hasUnmappedColors && (
        <p
          role="note"
          className="rounded-xl border border-gold/40 bg-gold-soft/30 p-3 text-sm leading-relaxed text-ink"
        >
          Some colours for this selection vary by faculty or discipline and are shown as a neutral
          grey placeholder. Check the official source below for your exact colours.
        </p>
      )}

      <p className="rounded-xl bg-blush/70 p-3.5 text-sm leading-relaxed text-maroon-deep">
        {view.notes}
      </p>

      <a
        href={view.university.officialSource}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm font-semibold text-maroon underline-offset-2 hover:underline"
      >
        Official academic dress information ↗
      </a>

      <p className="text-[11px] leading-relaxed text-ink-soft/80">
        Colours are approximations for a portfolio demo, sourced from university regulations and
        regalia suppliers. Always confirm with your university before ordering regalia.
      </p>
    </section>
  );
}
