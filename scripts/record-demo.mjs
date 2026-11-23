// Records the README demo: sign up, try a few universities and levels, pick a
// faculty, orbit the model with the keyboard, and save the look.
//
// Usage (with the app running on http://localhost:3000):
//   npm run demo:record
// Writes docs/demo.webm, then converts it to docs/demo.gif with ffmpeg.

import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import path from "node:path";

const BASE_URL = process.env.DEMO_URL ?? "http://localhost:3000";
const OUT_DIR = path.resolve("docs");
const TMP_DIR = path.join(OUT_DIR, ".recording");
const SIZE = { width: 1280, height: 860 };

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

mkdirSync(TMP_DIR, { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const context = await browser.newContext({
  viewport: SIZE,
  deviceScaleFactor: 1,
  recordVideo: { dir: TMP_DIR, size: SIZE },
});
const page = await context.newPage();
const recordingStart = Date.now();

// Sign up first; this part is trimmed off the final GIF.
await page.goto(`${BASE_URL}/login?mode=signup&next=/studio`);
await page.getByLabel("Name").fill("Priya");
await page.getByLabel("Email").fill(`demo-${Date.now()}@example.edu.au`);
await page.getByLabel("Password").fill("demo-password");
await pause(400);
await page.getByRole("button", { name: "Create my account" }).click();
await page.getByRole("heading", { name: /Welcome back/ }).waitFor();
await page.locator("canvas[data-engine]").waitFor();

// Line the configurator up just under the sticky nav, then start the clip.
await page.evaluate(() => {
  const viewer = document.querySelector('[aria-label="3D regalia preview"]');
  window.scrollTo(0, viewer.getBoundingClientRect().top + window.scrollY - 80);
});
await pause(1200);
const clipStart = (Date.now() - recordingStart) / 1000;
await pause(1200);

for (const uni of ["Melbourne", "UQ", "Monash"]) {
  await page.getByRole("button", { name: new RegExp(uni) }).click();
  await pause(1100);
}
await page.getByRole("button", { name: "PhD" }).click();
await pause(1300);

await page.getByRole("button", { name: /Sydney/ }).click();
await page.getByRole("button", { name: "Bachelor" }).click();
await pause(900);
await page.getByRole("combobox", { name: "Faculty / discipline" }).selectOption({ label: "Law (LLB)" });
await pause(1300);

// Keyboard orbit.
await page.getByRole("button", { name: "Pause rotation" }).click();
const viewer = page.getByRole("group", { name: /3D preview of/ });
await viewer.focus();
for (let i = 0; i < 6; i++) {
  await page.keyboard.press("ArrowRight");
  await pause(170);
}
await pause(700);

await page.getByRole("button", { name: "Save this look" }).click();
await pause(1600);

await context.close();
await browser.close();

const [video] = readdirSync(TMP_DIR).filter((f) => f.endsWith(".webm"));
const webm = path.join(OUT_DIR, "demo.webm");
renameSync(path.join(TMP_DIR, video), webm);
rmSync(TMP_DIR, { recursive: true, force: true });

// Two-pass palette GIF from the studio onward: 900px wide at 10fps keeps it
// small enough for a README.
const gif = path.join(OUT_DIR, "demo.gif");
execFileSync(
  "ffmpeg",
  [
    "-y",
    "-ss",
    clipStart.toFixed(2),
    "-i",
    webm,
    "-vf",
    "fps=10,scale=900:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle",
    gif,
  ],
  { stdio: "inherit" },
);
console.log(`Wrote ${path.relative(process.cwd(), gif)}`);
