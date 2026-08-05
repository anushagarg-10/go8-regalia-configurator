# Grad Choice

[![CI](https://github.com/anushagarg-10/go8-regalia-configurator/actions/workflows/ci.yml/badge.svg)](https://github.com/anushagarg-10/go8-regalia-configurator/actions/workflows/ci.yml)

A 3D configurator for graduation regalia at Australia's Group of Eight universities.
Pick a university, a degree level, and (where it matters) your faculty, and see the
actual gown, hood, and cap colours on a mannequin you can rotate and zoom.

I built this as a portfolio project. Partly to get more comfortable with React
Three Fiber, and partly because it's genuinely hard to find out what your own
academic dress will actually look like before graduation day, especially once
faculty specific hood colours are involved.

## What it does

- Renders gowns, hoods, and caps for ANU, Sydney, Melbourne, UQ, UWA, Adelaide,
  Monash, and UNSW, across Bachelor, Masters, and PhD
- Lets you pick your faculty for the universities where hood colour actually
  depends on it (most of them do). Where I couldn't confirm a colour from an
  official source, the app shows a plain grey placeholder instead of guessing
- Everything on screen is procedural geometry and shader materials built in
  Three.js. No downloaded 3D model files
- You can copy a link to your exact look, or download it as a PNG card
- A basic account system (stored in the browser, no real backend yet) lets you
  save looks so they're still there next time

## Where the data comes from

Gown, hood, and cap details are taken from each university's official academic
dress regulations, checked against the regalia suppliers those universities
actually use. Sources are recorded next to the data itself in `src/data`. A
handful of colours genuinely vary by faculty and aren't documented publicly in
enough detail to confirm, so those show as "varies" rather than a made up hex
code.

## Stack

Next.js (App Router), TypeScript, React Three Fiber, Tailwind, Vitest for tests.

## Running it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm test
npm run lint
npm run build
```

## Project layout

- `src/data` - the researched regalia data, with sources
- `src/lib/regalia.ts` - the lookup logic (the one place a real backend would
  plug in later)
- `src/lib/auth.ts` - localStorage based demo auth
- `src/app/api` - the two API routes the UI actually talks to
- `src/app/studio` - the 3D configurator itself, sitting behind a demo login
- `src/components/scene` - the mannequin and regalia geometry

## Tests

Around 50 tests covering the data lookup logic, both API routes, the auth flow,
and a handful of assertions on the 3D scene (material colours, mannequin
variants) using `@react-three/test-renderer`, so they run headlessly in CI.

## Not done yet

- Real accounts. Supabase is the obvious next step, and the auth and data
  layers were written with that swap in mind, so it shouldn't touch the UI
- An actual deployment people can use
- A proper human figure instead of the procedural mannequin

## About the data and the universities

This is an independent project, not affiliated with any university. University
marks shown in the app are their own public site icons, used only so you can
tell which university you're looking at. Colours are close approximations for
a portfolio demo, not colour matched to any official standard. Please don't
order real regalia based on anything shown here.
