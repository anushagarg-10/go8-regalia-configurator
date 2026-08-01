# Regalia Eight · Go8 Graduation Regalia Configurator

Pick an Australian Group of Eight university and a degree level (Bachelor or PhD) and
preview the academic gown, hood, and cap in an interactive 3D studio: orbit, zoom,
and rotate instead of static photos. Editorial landing page, graduate portal with
saved looks, and a physically shaded cloth model, all data-driven.

## Tech stack

- **Next.js (App Router) + TypeScript + React**
- **React Three Fiber + drei** for the 3D scene (simple primitives, flat shading — this
  is a product configurator, not a path tracer)
- **Tailwind CSS** for the UI
- **Vitest + React Testing Library + @react-three/test-renderer** for tests
- **GitHub Actions** for CI (tests + build on every push/PR to `main`)

## Architecture

```
src/data/go8Universities.js    Researched seed data (imported as-is, do not edit)
src/data/go8Universities.d.ts  Types describing the seed data's shape
src/lib/regalia.ts             Data access + colour resolution (the Supabase swap point)
src/lib/auth.ts                Demo auth + saved looks in localStorage (Supabase Auth swap point)
src/app/api/universities/      GET list of universities
src/app/api/regalia/           GET resolved config ?university=<id>&level=<bachelor|phd>
src/app/login/                 Graduate portal (sign in / create account)
src/components/                Landing sections, selector, info panel, configurator shell
src/components/scene/          R3F mannequin model + studio viewer
```

The demo auth deliberately mirrors an auth-provider API surface (signUp/signIn/
getSession/signOut plus per-user saved looks) so swapping in Supabase Auth and a
`saved_looks` table later does not touch component code. Passwords are salted and
SHA-256 hashed in the browser, but it is a demo, not a production credential store,
and the UI says so.

The UI talks to the data only through the API routes, and the API routes talk to the
data only through `src/lib/regalia.ts` — swapping the local seed file for Supabase later
means changing that one module.

## Data accuracy

The seed data covers the eight Go8 universities (ANU, Sydney, Melbourne, UQ, UWA,
Adelaide, Monash, UNSW), sourced from official academic dress regulations and
established regalia suppliers. Important caveats, which the UI surfaces rather than
hides:

- Several universities (Sydney, Adelaide, UNSW, and others) vary hood colour by
  **faculty**, not just degree level. Faculty-dependent colours render as a neutral
  grey placeholder with an explicit warning, never as a made-up colour.
- Each university's `notes` and a link to its official academic dress page are always
  shown in the info panel.
- Hex values are reasonable approximations for a portfolio demo, not colour-matched
  Pantone specifications. Nobody should order real regalia based on this app.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # run the Vitest suite once
npm run test:watch # watch mode
npm run build      # production build
```

## Tests

- `src/lib/regalia.test.ts` — data lookup and colour resolution, including unknown
  university ids, invalid degree levels, and faculty-variation flagging
- `src/lib/auth.test.ts` — signup/signin validation, session lifecycle, password
  hashing, and per-user saved-look dedupe/removal
- `src/app/api/*/route.test.ts` — API route status codes and payloads (200/400/404)
- `src/components/scene/RegaliaModel.test.tsx` — the 3D scene mounts headlessly for
  every university/level and applies the right material colours
- `src/components/RegaliaSelector.test.tsx` — selector interaction and aria state
