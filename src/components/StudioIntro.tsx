"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { useSession } from "@/lib/useSession";

/**
 * Header for the studio. The studio itself is open to everyone: guests can
 * try every feature straight away, and an account is only needed to save
 * looks. Session state comes from useSession, which stays signed-out until
 * hydration completes.
 */
export default function StudioIntro({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, hydrated } = useSession();

  // The configurator rewrites the query string as the guest changes the look,
  // so read it at click time rather than from the first render.
  function goToLogin(event: MouseEvent<HTMLAnchorElement>, mode: "signin" | "signup") {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    const next = encodeURIComponent(`${window.location.pathname}${window.location.search}`);
    router.push(`/login?${mode === "signup" ? "mode=signup&" : ""}next=${next}`);
  }

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
      <>
        <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-maroon">The studio</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Try on your{" "}
            <span className="font-script text-4xl font-normal text-maroon sm:text-5xl">regalia</span>
          </h1>
          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-maroon/15 bg-blush/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-ink">
              <span className="font-semibold text-maroon-deep">No sign-up needed.</span> Pick a
              university, spin the model, and share the link. Create a free account only if you
              want to save looks for later.
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/login?mode=signup&next=${next}`}
                onClick={(event) => goToLogin(event, "signup")}
                className="rounded-full bg-maroon px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-maroon-deep"
              >
                Create free account
              </Link>
              <Link
                href={`/login?next=${next}`}
                onClick={(event) => goToLogin(event, "signin")}
                className="rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-maroon hover:text-maroon"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
        {children}
      </>
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
