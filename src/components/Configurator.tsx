"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import RegaliaSelector from "@/components/RegaliaSelector";
import RegaliaInfoPanel from "@/components/RegaliaInfoPanel";
import type { DegreeLevel, RegaliaView, UniversitySummary } from "@/lib/regalia";

// three.js has no place on the server; load the viewer client-side only.
const RegaliaViewer = dynamic(() => import("@/components/scene/RegaliaViewer"), {
  ssr: false,
  loading: () => <ViewerPlaceholder message="Loading 3D viewer…" />,
});

function ViewerPlaceholder({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
      {message}
    </div>
  );
}

export default function Configurator() {
  const [universities, setUniversities] = useState<UniversitySummary[]>([]);
  const [universityId, setUniversityId] = useState("anu");
  const [level, setLevel] = useState<DegreeLevel>("bachelor");
  const [view, setView] = useState<RegaliaView | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    fetch(`/api/regalia?university=${encodeURIComponent(universityId)}&level=${level}`)
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
  }, [universityId, level]);

  return (
    <main className="flex flex-1 flex-col lg:min-h-0 lg:flex-row">
      <section
        aria-label="3D regalia preview"
        className="relative h-[52dvh] shrink-0 bg-gradient-to-b from-zinc-100 to-zinc-300 lg:h-auto lg:min-h-0 lg:flex-1 dark:from-zinc-600 dark:to-zinc-900"
      >
        {view ? <RegaliaViewer view={view} /> : <ViewerPlaceholder message="Loading regalia…" />}
        <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
          Drag to rotate · scroll or pinch to zoom
        </p>
      </section>

      <aside className="w-full space-y-5 overflow-y-auto border-t border-zinc-200 p-4 lg:w-[400px] lg:shrink-0 lg:border-l lg:border-t-0 dark:border-zinc-800">
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200"
          >
            {error}
          </p>
        )}
        {universities.length > 0 ? (
          <RegaliaSelector
            universities={universities}
            selectedUniversityId={universityId}
            selectedLevel={level}
            onUniversityChange={setUniversityId}
            onLevelChange={setLevel}
          />
        ) : (
          !error && <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading universities…</p>
        )}
        {view && <RegaliaInfoPanel view={view} />}
      </aside>
    </main>
  );
}
