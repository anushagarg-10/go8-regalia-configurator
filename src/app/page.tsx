import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import Configurator from "@/components/Configurator";
import LaurelStat from "@/components/LaurelStat";
import Reveal from "@/components/Reveal";
import { listUniversities } from "@/lib/regalia";

const HERO_PORTRAIT =
  "https://images.unsplash.com/photo-1623461487986-9400110de28e?q=80&w=900&auto=format&fit=crop";
const HERO_SNAPSHOT =
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=700&auto=format&fit=crop";
const HERO_MOBILE =
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop";
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
    a: "Yes. Create a free account from the Sign in button and a Save this look button appears in the configurator. Saved looks are stored in your browser in this demo.",
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
      <SiteNav />

      {/* Hero */}
      <section className="grain relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:pb-24 lg:pt-20">
          <div>
            <div className="hero-rise hero-rise-1">
              <Eyebrow index="01">The 3D dressing room</Eyebrow>
            </div>
            <h1 className="hero-rise hero-rise-2 mt-5 max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Your graduation look,
              <br />
              <span className="font-script text-6xl font-normal text-maroon sm:text-7xl lg:text-8xl">
                rendered before the big day
              </span>
            </h1>
            <p className="hero-rise hero-rise-3 mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              Pick any Group of Eight university and degree level, then walk around your gown,
              hood, and cap in a live 3D studio. No stiff catalogue photos, no guessing what smalt
              blue actually looks like.
            </p>

            <div className="hero-rise hero-rise-4 mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/#configurator"
                className="btn-shine rounded-full bg-maroon px-6 py-3 text-sm font-semibold text-cream shadow-lg shadow-maroon/25 transition-transform hover:scale-105 hover:bg-maroon-deep"
              >
                Style my gown
              </Link>
              <Link
                href="/#faq"
                className="rounded-full border border-ink/15 bg-white/60 px-6 py-3 text-sm font-semibold text-ink transition-all hover:scale-105 hover:border-maroon hover:text-maroon"
              >
                Read the fine print
              </Link>
            </div>

            {/* mobile hero image */}
            <div className="hero-rise hero-rise-4 mt-8 overflow-hidden rounded-2xl border-4 border-white shadow-xl lg:hidden">
              <Image
                src={HERO_MOBILE}
                alt="Graduate wearing an academic cap and gown"
                width={1200}
                height={800}
                priority
                className="h-52 w-full object-cover"
              />
            </div>

            <div className="hero-rise hero-rise-5 mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
              <LaurelStat value="8" label="Go8 universities" />
              <LaurelStat value="24" label="Regalia combinations" />
              <LaurelStat value="360°" label="Orbit, zoom, admire" />
            </div>
          </div>

          {/* editorial photo collage */}
          <div className="hero-rise hero-rise-3 relative hidden lg:block">
            <div className="relative ml-auto w-[360px]">
              <div className="floaty overflow-hidden rounded-b-3xl rounded-t-[180px] border-[6px] border-white shadow-[0_35px_70px_-30px_rgba(82,18,37,0.45)]">
                <Image
                  src={HERO_PORTRAIT}
                  alt="Graduate in cap and gown smiling"
                  width={720}
                  height={1080}
                  priority
                  className="h-[480px] w-full object-cover"
                />
              </div>
              <div className="sway absolute -left-28 bottom-8 w-56 overflow-hidden rounded-2xl border-[6px] border-white shadow-xl">
                <Image
                  src={HERO_SNAPSHOT}
                  alt="Graduates throwing their caps in the air"
                  width={700}
                  height={467}
                  className="h-36 w-full object-cover"
                />
              </div>
              <p className="scribble-bob absolute -right-6 top-4 font-script text-3xl text-maroon">
                class of 2026!
              </p>
            </div>
          </div>
        </div>

        {/* Scrolling ribbon */}
        <div className="marquee border-y border-ink/10 bg-maroon py-2.5">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <p
                key={copy}
                aria-hidden={copy === 1}
                className="whitespace-nowrap pr-8 text-[11px] font-semibold uppercase tracking-[0.35em] text-cream/80"
              >
                Class of 2026 · ANU · Sydney · Melbourne · UQ · UWA · Adelaide · Monash · UNSW ·
                Bachelor · Masters · PhD · Your gown in 3D ·{" "}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Configurator */}
      <section id="configurator" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <Reveal>
            <Eyebrow index="02">Build your look</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              We don&apos;t just render gowns,{" "}
              <span className="font-script text-4xl font-normal text-maroon sm:text-5xl">
                we dress your milestone
              </span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
              Every colour below is driven by researched academic dress data. Where a colour depends
              on your faculty, we tell you instead of pretending.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-8">
            <Configurator />
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
                  <p className="font-display text-lg font-bold text-ink group-hover:text-maroon">
                    {u.shortName}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">{u.location}</p>
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
            href="/#configurator"
            className="mt-8 inline-block rounded-full bg-cream px-8 py-3.5 text-sm font-bold text-maroon-deep shadow-xl transition-transform hover:scale-105"
          >
            Open the configurator
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cream/10 bg-charcoal text-cream/70">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="flex items-baseline gap-1">
              <span className="font-display text-xl font-bold text-cream">Regalia</span>
              <span className="font-script text-2xl leading-none text-gold-soft">Eight</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">
              An independent 3D preview of Group of Eight graduation dress. Built as a portfolio
              project. Not affiliated with any university.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream">Explore</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/#configurator" className="hover:text-gold-soft">Configurator</Link></li>
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
          © 2026 Regalia Eight. Colours are approximations; always confirm with your university.
          Photography via Unsplash.
        </div>
      </footer>
    </div>
  );
}
