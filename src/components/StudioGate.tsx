"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useSession } from "@/lib/useSession";

/**
 * Renders children only for signed-in users; otherwise shows an elegant
 * members-only prompt. Session state comes from useSession, which stays
 * signed-out until hydration completes.
 */
export default function StudioGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { session, hydrated } = useSession();

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-ink-soft">
        Unlocking the studio…
      </div>
    );
  }

  if (!session) {
    // Preserve the full URL (including any shared-look params) through login.
    const next = encodeURIComponent(`${pathname}${window.location.search}`);
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
            href={`/login?mode=signup&next=${next}`}
            className="btn-shine rounded-full bg-maroon px-6 py-3 text-sm font-semibold text-cream shadow-lg shadow-maroon/25 transition-transform hover:scale-105"
          >
            Create free account
          </Link>
          <Link
            href={`/login?next=${next}`}
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
