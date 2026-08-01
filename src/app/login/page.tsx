"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { signIn, signUp } from "@/lib/auth";
import { announceAuthChange } from "@/components/SiteNav";

const PANEL_PHOTO =
  "https://images.unsplash.com/photo-1621376225372-c86f16f47a09?q=80&w=1000&auto=format&fit=crop";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Deep links like /login?mode=signup open on the create-account tab.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("mode") === "signup") {
      setMode("signup");
    }
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const result =
      mode === "signin" ? await signIn(email, password) : await signUp(email, password, name);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    announceAuthChange();
    router.push("/studio");
  }

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      {/* Brand panel */}
      <aside className="relative flex flex-col justify-between overflow-hidden bg-maroon-deep px-8 py-10 text-cream lg:w-[44%] lg:px-12">
        <Image
          src={PANEL_PHOTO}
          alt=""
          fill
          sizes="(min-width: 1024px) 44vw, 100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-maroon-deep/70 via-maroon-deep/55 to-maroon-deep/85" aria-hidden />
        <Link href="/" className="relative z-10 flex items-baseline gap-1">
          <span className="font-display text-xl font-bold tracking-tight text-cream">Regalia</span>
          <span className="font-script text-2xl leading-none text-gold-soft">Eight</span>
        </Link>

        <div className="relative z-10 py-16 lg:py-0">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-soft">
            The graduate portal
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight lg:text-5xl">
            Your gown,
            <br />
            saved for the
            <br />
            <span className="font-script text-5xl font-normal text-gold-soft lg:text-6xl">
              big day.
            </span>
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/70">
            Create a free account to save your regalia looks, compare universities, and come back
            to your configuration whenever the ceremony gets real.
          </p>
        </div>

        <p className="relative z-10 text-xs text-cream/50">
          Demo portal. Accounts live only in this browser and can be swapped for Supabase Auth
          without touching the UI.
        </p>
      </aside>

      {/* Form panel */}
      <main className="grain flex flex-1 items-center justify-center bg-cream px-6 py-12">
        <div className="relative w-full max-w-md">
          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-[0_24px_60px_-30px_rgba(82,18,37,0.35)]">
            <div className="mb-6 grid grid-cols-2 rounded-full border border-ink/10 bg-cream p-1 text-sm font-semibold">
              {(
                [
                  ["signin", "Sign in"],
                  ["signup", "Create account"],
                ] as [Mode, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={mode === value}
                  onClick={() => {
                    setMode(value);
                    setError(null);
                  }}
                  className={`rounded-full px-4 py-2 transition-colors ${
                    mode === value ? "bg-maroon text-cream shadow-sm" : "text-ink-soft hover:text-maroon"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <h2 className="font-display text-2xl font-bold text-ink">
              {mode === "signin" ? "Welcome back" : "Join the class"}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              {mode === "signin"
                ? "Pick up right where your last fitting ended."
                : "Save looks and revisit them before the ceremony."}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === "signup" && (
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">Name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-maroon focus:ring-2 focus:ring-maroon/20"
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu.au"
                  className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-maroon focus:ring-2 focus:ring-maroon/20"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Password</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-maroon focus:ring-2 focus:ring-maroon/20"
                />
              </label>

              {error && (
                <p role="alert" className="rounded-xl border border-maroon/30 bg-blush px-4 py-2.5 text-sm text-maroon-deep">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full bg-maroon px-4 py-3 text-sm font-semibold text-cream shadow-md transition-colors hover:bg-maroon-deep disabled:opacity-60"
              >
                {busy ? "One moment…" : mode === "signin" ? "Sign in" : "Create my account"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs leading-relaxed text-ink-soft">
              Demo authentication: your account is stored only in this browser.
              <br />
              Never reuse a real password here.
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-ink-soft">
            Just browsing?{" "}
            <Link href="/" className="font-semibold text-maroon underline-offset-2 hover:underline">
              Explore the site without an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
