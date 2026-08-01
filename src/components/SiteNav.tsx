"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { announceAuthChange, signOut } from "@/lib/auth";
import { useSession } from "@/lib/useSession";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studio", label: "Studio" },
  { href: "/#universities", label: "Universities" },
  { href: "/#faq", label: "FAQs" },
];

export default function SiteNav({ variant = "solid" }: { variant?: "solid" | "overlay" }) {
  const pathname = usePathname();
  const { session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (variant !== "overlay") return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  // Over the photo hero the nav floats transparent with light text,
  // then solidifies to cream once the page scrolls (or the menu opens).
  const transparent = variant === "overlay" && !scrolled && !menuOpen;

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return !href.includes("#") && pathname.startsWith(href);
  }

  function handleSignOut() {
    signOut();
    announceAuthChange();
  }

  return (
    <header
      className={`${variant === "overlay" ? "fixed" : "sticky"} top-0 z-40 w-full border-b transition-colors duration-300 ${
        transparent
          ? "border-transparent bg-transparent"
          : "border-ink/10 bg-cream/85 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-1">
          <span
            className={`font-display text-xl font-bold tracking-tight ${transparent ? "text-cream" : "text-maroon"}`}
          >
            Grad
          </span>
          <span className={`font-script text-2xl leading-none ${transparent ? "text-gold-soft" : "text-gold"}`}>
            Choice
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-1 text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:transition-all after:duration-300 ${
                transparent
                  ? `after:bg-gold-soft hover:text-cream ${
                      isActive(link.href) ? "text-cream after:w-full" : "text-cream/70 after:w-0 hover:after:w-full"
                    }`
                  : `after:bg-maroon hover:text-maroon ${
                      isActive(link.href) ? "text-maroon after:w-full" : "text-ink-soft after:w-0 hover:after:w-full"
                    }`
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden items-center gap-2.5 md:flex">
          {session ? (
            <>
              <span className="flex items-center gap-2 rounded-full border border-ink/10 bg-white py-1 pl-1 pr-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-maroon font-display text-xs font-bold text-cream">
                  {session.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-28 truncate text-sm font-medium text-ink">
                  {session.name}
                </span>
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  transparent
                    ? "border-cream/40 text-cream hover:border-cream hover:bg-cream/10"
                    : "border-ink/15 text-ink-soft hover:border-maroon hover:text-maroon"
                }`}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`px-2 py-2 text-sm font-semibold transition-colors ${
                  transparent ? "text-cream/80 hover:text-cream" : "text-ink-soft hover:text-maroon"
                }`}
              >
                Sign in
              </Link>
              <Link
                href="/studio"
                className={`btn-shine rounded-full px-4 py-2 text-sm font-semibold transition-transform hover:scale-105 ${
                  transparent
                    ? "bg-cream text-maroon-deep shadow-lg"
                    : "bg-maroon text-cream shadow-sm shadow-maroon/30"
                }`}
              >
                Open the studio
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className={`flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border md:hidden ${
            transparent ? "border-cream/40 bg-cream/10" : "border-ink/10 bg-white"
          }`}
        >
          <span
            className={`h-0.5 w-4.5 rounded-full transition-transform ${transparent ? "bg-cream" : "bg-ink"} ${menuOpen ? "translate-y-1 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-4.5 rounded-full transition-transform ${transparent ? "bg-cream" : "bg-ink"} ${menuOpen ? "-translate-y-1 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-ink/10 bg-cream px-4 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold ${
                  isActive(link.href) ? "bg-blush text-maroon" : "text-ink hover:bg-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2.5 border-t border-ink/10 pt-4">
            {session ? (
              <>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon font-display text-sm font-bold text-cream">
                  {session.name.charAt(0).toUpperCase()}
                </span>
                <span className="flex-1 truncate text-sm font-medium text-ink">{session.name}</span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-full border border-ink/15 bg-white px-4 py-2.5 text-center text-sm font-semibold text-ink"
                >
                  Sign in
                </Link>
                <Link
                  href="/studio"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-full bg-maroon px-4 py-2.5 text-center text-sm font-semibold text-cream"
                >
                  Open the studio
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
