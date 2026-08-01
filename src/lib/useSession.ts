"use client";

import { useMemo, useSyncExternalStore } from "react";
import { getSessionRaw, subscribeToAuth, type Session } from "@/lib/auth";

const noopSubscribe = () => () => {};

/**
 * Session state backed by localStorage via useSyncExternalStore: SSR and
 * hydration render as signed-out (`hydrated: false`), then the real
 * session appears without effect-driven setState.
 */
export function useSession(): { session: Session | null; hydrated: boolean } {
  const raw = useSyncExternalStore(subscribeToAuth, getSessionRaw, () => null);
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const session = useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Session;
    } catch {
      return null;
    }
  }, [raw]);

  return { session, hydrated };
}
