import { defineConfig, devices } from "@playwright/test";

// The app always runs on port 3000. Locally this reuses a running `npm run dev`;
// in CI it serves the production build so the tests hit what Netlify ships.
// Set BASE_URL to run the same suite against a deployed site instead.
const PORT = 3000;
const REMOTE_URL = process.env.BASE_URL;
const BASE_URL = REMOTE_URL ?? `http://localhost:${PORT}`;
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
      // Mobile run covers layout-sensitive flows only; the rest is identical.
      grep: /@mobile/,
    },
  ],
  webServer: REMOTE_URL
    ? undefined
    : {
        command: isCI ? "npm run start" : "npm run dev",
        url: BASE_URL,
        reuseExistingServer: !isCI,
        timeout: 120_000,
      },
});
