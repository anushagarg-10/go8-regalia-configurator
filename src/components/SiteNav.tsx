"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSession, signOut, type Session } from "@/lib/auth";

export const AUTH_EVENT = "go8:auth-changed";

export function announceAuthChange() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export default function SiteNav() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const sync = () => setSession(getSession());
    sync();
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-baseline gap-1">
          <span className="font-display text-xl font-bold tracking-tight text-maroon">
            Regalia
          </span>
          <span className="font-script text-2xl leading-none text-gold">Eight</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-ink-soft sm:flex">
          <Link href="/#configurator" className="transition-colors hover:text-maroon">
            Configurator
          </Link>
          <Link href="/#universities" className="transition-colors hover:text-maroon">
            Universities
          </Link>
          <Link href="/#faq" className="transition-colors hover:text-maroon">
            FAQs
          </Link>
        </div>

        {session ? (
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon font-display text-sm font-bold text-cream">
              {session.name.charAt(0).toUpperCase()}
            </span>
            <span className="hidden max-w-32 truncate text-sm font-medium text-ink sm:block">
              {session.name}
            </span>
            <button
              type="button"
              onClick={() => {
                signOut();
                announceAuthChange();
              }}
              className="rounded-full border border-ink/15 px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:border-maroon hover:text-maroon"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-maroon px-4 py-2 text-sm font-semibold text-cream shadow-sm transition-colors hover:bg-maroon-deep"
          >
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
