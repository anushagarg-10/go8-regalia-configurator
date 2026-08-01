import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import LaurelStat from "@/components/LaurelStat";
import Reveal from "@/components/Reveal";
import { listUniversities, universityLogoUrl } from "@/lib/regalia";

const HERO_BACKDROP =
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop";
const HERO_PORTRAIT =
  "https://images.unsplash.com/photo-1623461487986-9400110de28e?q=80&w=900&auto=format&fit=crop";
const CTA_BACKDROP =
  "https://images.unsplash.com/photo-1633734973050-d6499a977c17?q=80&w=1800&auto=format&fit=crop";

function Eyebrow({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-maroon">
      ({index}) <span className="ml-2 text-ink-soft">{children}</span>
    </p>
  );
}

const FAQS: { q: string; a: string }[] = [
  {
    q: "Are these the exact official colours?",
    a: "They are careful approximations taken from official academic dress regulations and established regalia suppliers, rendered as hex colours. They are not Pantone matched. Every university card links to the official source so you can verify the fine detail.",
  },
  {
    q: "Why is part of a hood shown in grey?",
    a: "Some universities change hood colours by faculty or discipline, not just degree level. Where a colour depends on your faculty we show a neutral placeholder and say so, instead of guessing a colour that might be wrong for you.",
  },
  {
    q: "Which cap will I actually wear?",
    a: "Bachelors and masters graduates at the Go8 wear the flat trencher. PhD graduates typically wear a soft velvet bonnet. Melbourne is the famous exception: bachelor graduates do not wear a mortarboard at the ceremony at all, and the viewer reflects that.",
  },
  {
    q: "Can I save my look?",
    a: "Yes. The 3D studio opens with a free account: sign up, dress the mannequin, and use Save this look to keep your combinations. Accounts and saved looks are stored in your browser in this demo.",
  },
  {
    q: "Is this affiliated with the universities?",
    a: "No. This is an independent portfolio project. All trademarks and regalia designs belong to their respective universities.",
  },
  {
    q: "Can I hire or buy regalia here?",
    a: "No, and you should not order regalia based on this preview. Book through your university's official graduation supplier once you have confirmed your faculty colours.",
  },
];

export default function Home() {
  const universities = listUniversities();

  return (
    <div className="min-h-dvh bg-cream text-ink">
      <SiteNav variant="overlay" />

      {/* Hero: full first screen; the photo stays fixed while the rest of
          the page scrolls up over it. */}
      <section className="relative overflow-hidden bg-charcoal">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(25,21,18,0.95), rgba(25,21,18,0.72) 45%, rgba(82,18,37,0.45)), url(${HERO_BACKDROP})`,
          }}
        />

        <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-4 pb-24 pt-24 sm:px-6">
          <p className="hero-rise hero-rise-1 text-xs font-semibold uppercase tracking-[0.25em] text-gold-soft">
            (01) <span className="ml-2 text-cream/60">The 3D dressing room</span>
          </p>
          <h1 className="hero-rise hero-rise-2 mt-5 max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-cream sm:text-6xl lg:text-7xl">
            Your graduation look,
            <br />
            <span className="font-script text-6xl font-normal text-gold-soft sm:text-7xl lg:text-8xl">
              rendered before the big day
            </span>
          </h1>
          <p className="hero-rise hero-rise-3 mt-6 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg">
            Pick any Group of Eight university and degree level, then walk around your gown, hood,
            and cap in a live 3D studio. No stiff catalogue photos, no guessing what smalt blue
            actually looks like.
          </p>

          <div className="hero-rise hero-rise-4 mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/studio"
              className="btn-shine rounded-full bg-cream px-6 py-3 text-sm font-bold text-maroon-deep shadow-xl transition-transform hover:scale-105"
            >
              Open the studio
            </Link>
            <Link
              href="/#faq"
              className="rounded-full border border-cream/35 px-6 py-3 text-sm font-semibold text-cream transition-all hover:scale-105 hover:border-cream hover:bg-cream/10"
            >
              Read the fine print
            </Link>
          </div>

          <div className="hero-rise hero-rise-5 mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
            <LaurelStat value="8" label="Go8 universities" tone="light" />
            <LaurelStat value="24" label="Regalia combinations" tone="light" />
            <LaurelStat value="360°" label="Orbit, zoom, admire" tone="light" />
          </div>

          {/* Scroll cue */}
          <Link
            href="/#how-it-works"
            aria-label="Scroll down to how it works"
            className="absolute bottom-7 left-1/2 flex h-11 w-11 -translate-x-1/2 animate-bounce items-center justify-center rounded-full border border-cream/40 bg-cream/10 text-cream backdrop-blur transition-colors hover:bg-cream/25 motion-reduce:animate-none"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 6l5 5 5-5" />
            </svg>
          </Link>
        </div>

      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <Reveal>
            <Eyebrow index="02">How it works</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              We don&apos;t just render gowns,{" "}
              <span className="font-script text-4xl font-normal text-maroon sm:text-5xl">
                we dress your milestone
              </span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
              Every colour in the studio is driven by researched academic dress data, from official
              regulations and university regalia suppliers. Where a colour depends on your faculty,
              we ask instead of pretending.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                step: "one",
                title: "Pick your university",
                copy: "All eight Go8 campuses, each with its real gown, hood, and cap rules.",
              },
              {
                step: "two",
                title: "Choose level & faculty",
                copy: "Bachelor, Masters, or PhD, then your faculty for the exact hood colours.",
              },
              {
                step: "three",
                title: "Orbit your fit in 3D",
                copy: "Spin the mannequin, swap builds and finishes, and save the looks you love.",
              },
            ].map((item, index) => (
              <Reveal key={item.step} delay={index * 110}>
                <div className="group h-full rounded-2xl border border-ink/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-maroon/40 hover:shadow-xl hover:shadow-maroon/15">
                  <p className="font-script text-4xl text-gold">{item.step}</p>
                  <h3 className="mt-3 font-display text-lg font-bold text-ink group-hover:text-maroon">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Studio teaser */}
          <Reveal delay={150} className="mt-10">
            <div className="grain relative overflow-hidden rounded-3xl bg-maroon-deep px-6 py-10 text-center text-cream sm:px-12 lg:flex lg:items-center lg:justify-between lg:text-left">
              <div className="relative z-10">
                <p className="font-script text-3xl text-gold-soft">members only</p>
                <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                  The 3D studio opens with a free account
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-cream/70">
                  Sign up in seconds to dress the mannequin, unlock faculty colours, and keep your
                  saved looks waiting for graduation morning.
                </p>
              </div>
              <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-3 lg:mt-0 lg:shrink-0">
                <Link
                  href="/studio"
                  className="btn-shine rounded-full bg-cream px-6 py-3 text-sm font-bold text-maroon-deep shadow-xl transition-transform hover:scale-105"
                >
                  Open the studio
                </Link>
                <Link
                  href="/login?mode=signup"
                  className="rounded-full border border-cream/30 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:border-cream hover:bg-cream/10"
                >
                  Create free account
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Universities */}
      <section id="universities" className="scroll-mt-20 border-y border-ink/10 bg-cream-deep">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Reveal>
            <Eyebrow index="03">The Group of Eight</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Every campus, <span className="font-script text-4xl font-normal text-maroon sm:text-5xl">one wardrobe</span>
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {universities.map((u, index) => (
              <Reveal key={u.id} delay={index * 70}>
                <a
                  href={u.officialSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl border border-ink/10 bg-white p-4 transition-all duration-300 hover:-translate-y-1.5 hover:rotate-1 hover:border-maroon/40 hover:shadow-xl hover:shadow-maroon/15"
                >
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element -- tiny remote favicon, no optimization needed */}
                    <img
                      src={universityLogoUrl(u.officialSource)}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-md border border-ink/10 bg-white object-contain p-0.5"
                    />
                    <p className="font-display text-lg font-bold text-ink group-hover:text-maroon">
                      {u.shortName}
                    </p>
                  </div>
                  <p className="mt-1.5 text-xs text-ink-soft">{u.location}</p>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-maroon/70">
                    Official dress info ↗
                  </p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-blush">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:py-20">
          <Reveal>
            <Eyebrow index="04">Frequently asked questions</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Before you{" "}
              <span className="font-script text-4xl font-normal text-maroon sm:text-5xl">
                lock in the look
              </span>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
              Everything worth knowing about how accurate this preview is, and where it politely
              refuses to guess.
            </p>
            <div className="mt-8 hidden w-64 overflow-hidden rounded-b-3xl rounded-t-[128px] border-[5px] border-white shadow-[0_25px_55px_-25px_rgba(82,18,37,0.4)] lg:block">
              <Image
                src={HERO_PORTRAIT}
                alt="Graduate in cap and gown smiling"
                width={720}
                height={1080}
                className="h-80 w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={100} className="divide-y divide-maroon/15">
            {FAQS.map((faq) => (
              <details key={faq.q} className="faq-item group py-4">
                <summary className="flex items-center justify-between gap-4 text-left">
                  <span className="text-sm font-semibold text-ink sm:text-base">{faq.q}</span>
                  <span className="faq-marker flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-maroon/30 text-maroon" />
                </summary>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">{faq.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden bg-charcoal">
        <Image
          src={CTA_BACKDROP}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/60 to-charcoal/85" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 lg:py-28">
          <p className="font-script text-5xl text-cream sm:text-6xl lg:text-7xl">
            Ready to be the main character?
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cream/60">
            Open the studio, spin the gown, screenshot the fit, and send it to the group chat.
          </p>
          <Link
            href="/studio"
            className="btn-shine mt-8 inline-block rounded-full bg-cream px-8 py-3.5 text-sm font-bold text-maroon-deep shadow-xl transition-transform hover:scale-105"
          >
            Open the studio
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cream/10 bg-charcoal text-cream/70">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="flex items-baseline gap-1">
              <span className="font-display text-xl font-bold text-cream">Grad</span>
              <span className="font-script text-2xl leading-none text-gold-soft">Choice</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">
              An independent 3D preview of Group of Eight graduation dress. Built as a portfolio
              project. Not affiliated with any university; university marks appear for
              identification only.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream">Explore</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/studio" className="hover:text-gold-soft">The studio</Link></li>
              <li><Link href="/#universities" className="hover:text-gold-soft">Universities</Link></li>
              <li><Link href="/#faq" className="hover:text-gold-soft">FAQs</Link></li>
              <li><Link href="/login" className="hover:text-gold-soft">Graduate portal</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream">
              Official dress sources
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {universities.map((u) => (
                <li key={u.id}>
                  <a
                    href={u.officialSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold-soft"
                  >
                    {u.shortName} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/40">
          © Grad Choice. Colours are approximations; always confirm with your university.
          Photography via Unsplash.
        </div>
      </footer>
    </div>
  );
}
