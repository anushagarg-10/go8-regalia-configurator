"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import RegaliaSelector from "@/components/RegaliaSelector";
import RegaliaInfoPanel from "@/components/RegaliaInfoPanel";
import MannequinSelector from "@/components/MannequinSelector";
import { AUTH_EVENT } from "@/components/SiteNav";
import { DEFAULT_MANNEQUIN, type MannequinConfig } from "@/lib/mannequin";
import {
  getSession,
  listLooks,
  removeLook,
  saveLook,
  type SavedLook,
  type Session,
} from "@/lib/auth";
import type { DegreeLevel, RegaliaView, UniversitySummary } from "@/lib/regalia";
import { DEGREE_LEVEL_LABELS } from "@/lib/regalia";

// three.js has no place on the server; load the viewer client-side only.
const RegaliaViewer = dynamic(() => import("@/components/scene/RegaliaViewer"), {
  ssr: false,
  loading: () => <ViewerPlaceholder message="Warming up the studio lights…" />,
});

function ViewerPlaceholder({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-ink-soft">{message}</div>
  );
}

export default function Configurator() {
  const [universities, setUniversities] = useState<UniversitySummary[]>([]);
  const [universityId, setUniversityId] = useState("anu");
  const [level, setLevel] = useState<DegreeLevel>("bachelor");
  const [facultyId, setFacultyId] = useState<string | null>(null);
  const [view, setView] = useState<RegaliaView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [looks, setLooks] = useState<SavedLook[]>([]);
  const [mannequin, setMannequin] = useState<MannequinConfig>(DEFAULT_MANNEQUIN);
  const [confetti, setConfetti] = useState<
    { id: number; x: number; y: number; r: number; color: string }[]
  >([]);

  useEffect(() => {
    const sync = () => {
      const current = getSession();
      setSession(current);
      setLooks(current ? listLooks(current.email) : []);
    };
    sync();
    window.addEventListener(AUTH_EVENT, sync);
    return () => window.removeEventListener(AUTH_EVENT, sync);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/universities")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load universities (${res.status})`);
        return res.json();
      })
      .then((data: UniversitySummary[]) => {
        if (!cancelled) setUniversities(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load universities");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const facultyParam = facultyId ? `&faculty=${encodeURIComponent(facultyId)}` : "";
    fetch(`/api/regalia?university=${encodeURIComponent(universityId)}&level=${level}${facultyParam}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load regalia (${res.status})`);
        return res.json();
      })
      .then((data: RegaliaView) => {
        if (!cancelled) {
          setView(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load regalia");
      });
    return () => {
      cancelled = true;
    };
  }, [universityId, level, facultyId]);

  function handleUniversityChange(id: string) {
    setUniversityId(id);
    setFacultyId(null);
  }

  function handleLevelChange(next: DegreeLevel) {
    setLevel(next);
    setFacultyId(null);
  }

  function handleSaveLook() {
    if (!session || !view) return;
    const label = `${view.university.shortName} ${DEGREE_LEVEL_LABELS[view.degreeLevel]}`;
    setLooks(saveLook(session.email, { universityId, level, label }));
    // Celebration burst over the saved-looks card.
    const palette = ["#6d1f35", "#b98c3a", "#40b5ad", "#f6e3e0", "#c8102e"];
    setConfetti(
      Array.from({ length: 16 }, (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 240,
        y: -40 - Math.random() * 140,
        r: (Math.random() - 0.5) * 540,
        color: palette[i % palette.length],
      })),
    );
    window.setTimeout(() => setConfetti([]), 1200);
  }

  function handleRemoveLook(look: SavedLook) {
    if (!session) return;
    setLooks(removeLook(session.email, look.universityId, look.level));
  }

  const currentSaved = looks.some((l) => l.universityId === universityId && l.level === level);

  return (
    <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-[0_40px_90px_-45px_rgba(82,18,37,0.4)]">
      <div className="flex flex-col lg:flex-row">
        {/* Viewer */}
        <section
          aria-label="3D regalia preview"
          className="relative h-[48dvh] min-h-[380px] shrink-0 bg-gradient-to-b from-cream via-cream-deep to-[#d8cbb6] lg:h-auto lg:min-h-[600px] lg:flex-1"
        >
          {view ? (
            <RegaliaViewer view={view} mannequin={mannequin} />
          ) : (
            <ViewerPlaceholder message="Dressing the mannequin…" />
          )}
          <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/60 px-3.5 py-1.5 text-[11px] font-medium text-cream backdrop-blur">
            Drag to rotate · scroll or pinch to zoom
          </p>
          {view && (
            <p className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/70 px-3 py-1.5 font-display text-xs font-bold text-maroon backdrop-blur">
              {view.university.shortName} · {DEGREE_LEVEL_LABELS[view.degreeLevel]}
            </p>
          )}
        </section>

        {/* Controls */}
        <aside className="w-full space-y-5 border-t border-ink/10 bg-cream p-5 lg:max-h-[600px] lg:w-[400px] lg:shrink-0 lg:overflow-y-auto lg:border-l lg:border-t-0">
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-maroon/30 bg-blush p-3 text-sm text-maroon-deep"
            >
              {error}
            </p>
          )}

          {universities.length > 0 ? (
            <RegaliaSelector
              universities={universities}
              selectedUniversityId={universityId}
              selectedLevel={level}
              onUniversityChange={handleUniversityChange}
              onLevelChange={handleLevelChange}
            />
          ) : (
            !error && <p className="text-sm text-ink-soft">Loading universities…</p>
          )}

          {/* Faculty picker, shown when this selection has researched faculty colours */}
          {view && view.faculties.length > 0 && (
            <fieldset>
              <legend className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
                Faculty / discipline
              </legend>
              <select
                value={facultyId ?? ""}
                onChange={(e) => setFacultyId(e.target.value || null)}
                className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm font-medium text-ink outline-none transition-colors focus:border-maroon focus:ring-2 focus:ring-maroon/20"
              >
                <option value="">Not sure yet (neutral preview)</option>
                {view.faculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </fieldset>
          )}

          <MannequinSelector config={mannequin} onChange={setMannequin} />

          {/* Saved looks */}
          <div className="relative rounded-2xl border border-ink/10 bg-white p-4">
            {confetti.map((piece) => (
              <span
                key={piece.id}
                aria-hidden
                className="confetti-piece"
                style={
                  {
                    backgroundColor: piece.color,
                    "--cx": `${piece.x}px`,
                    "--cy": `${piece.y}px`,
                    "--cr": `${piece.r}deg`,
                  } as React.CSSProperties
                }
              />
            ))}
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
              Saved looks
            </p>
            {session ? (
              <div className="mt-3 space-y-3">
                <button
                  type="button"
                  onClick={handleSaveLook}
                  disabled={!view || currentSaved}
                  className="w-full rounded-full border border-maroon bg-maroon px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-maroon-deep disabled:border-ink/10 disabled:bg-cream disabled:text-ink-soft"
                >
                  {currentSaved ? "Look saved ✓" : "Save this look"}
                </button>
                {looks.length > 0 ? (
                  <ul className="flex flex-wrap gap-2">
                    {looks.map((look) => (
                      <li key={`${look.universityId}-${look.level}`}>
                        <span className="inline-flex items-center gap-1 rounded-full border border-maroon/25 bg-blush/60 py-1 pl-3 pr-1 text-xs font-medium text-maroon-deep">
                          <button
                            type="button"
                            onClick={() => {
                              setUniversityId(look.universityId);
                              setLevel(look.level);
                            }}
                            className="hover:underline"
                          >
                            {look.label}
                          </button>
                          <button
                            type="button"
                            aria-label={`Remove ${look.label}`}
                            onClick={() => handleRemoveLook(look)}
                            className="flex h-5 w-5 items-center justify-center rounded-full text-maroon/60 hover:bg-maroon hover:text-cream"
                          >
                            ×
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-ink-soft">
                    Nothing saved yet. Dial in a look and keep it for the big day.
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-ink-soft">
                <Link href="/login" className="font-semibold text-maroon underline-offset-2 hover:underline">
                  Sign in
                </Link>{" "}
                to save looks and come back to them later.
              </p>
            )}
          </div>

          {view && <RegaliaInfoPanel view={view} />}
        </aside>
      </div>
    </div>
  );
}
