"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { getSession, type Session } from "@/lib/auth";
import { AUTH_EVENT } from "@/components/SiteNav";

/**
 * Renders children only for signed-in users; otherwise shows an elegant
 * members-only prompt. Session state is read client-side after mount.
 */
export default function StudioGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const sync = () => setSession(getSession());
    sync();
    setReady(true);
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-ink-soft">
        Unlocking the studio…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:py-28">
        <p className="font-script text-5xl text-maroon">members only</p>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          The studio is behind the velvet rope
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">
          Create a free account (or sign back in) to dress the mannequin, pick your faculty
          colours, and save looks for the big day. Accounts live only in this browser.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login?mode=signup"
            className="btn-shine rounded-full bg-maroon px-6 py-3 text-sm font-semibold text-cream shadow-lg shadow-maroon/25 transition-transform hover:scale-105"
          >
            Create free account
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-ink/15 bg-white px-6 py-3 text-sm font-semibold text-ink transition-all hover:scale-105 hover:border-maroon hover:text-maroon"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-maroon">The studio</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Welcome back,{" "}
          <span className="font-script text-4xl font-normal text-maroon sm:text-5xl">
            {session.name}
          </span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Dress the mannequin, dial in your faculty colours, and save the looks you like.
        </p>
      </div>
      {children}
    </>
  );
}
