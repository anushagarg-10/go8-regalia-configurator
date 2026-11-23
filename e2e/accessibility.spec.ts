import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { openStudio } from "./helpers";

// WCAG 2.0 + 2.1, levels A and AA.
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    // Next.js dev tools inject their own overlay in development only.
    .exclude("nextjs-portal")
    .analyze();

  // Print a readable summary instead of a giant JSON diff on failure.
  const summary = results.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.help} -> ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
  );
  expect(summary, "axe-core WCAG 2.1 AA violations").toEqual([]);
}

test.describe("Accessibility (axe-core, WCAG 2.1 AA)", () => {
  // Scan the settled UI: scroll-reveal and hero animations switch off under
  // prefers-reduced-motion, so contrast is measured at full opacity.
  test.use({ reducedMotion: "reduce" });

  test("landing page @mobile", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectNoAxeViolations(page);
  });

  test("login page @mobile", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
    await expectNoAxeViolations(page);
  });

  test("studio gate (signed out)", async ({ page }) => {
    await page.goto("/studio");
    await expect(page.getByRole("link", { name: "Create free account" })).toBeVisible();
    await expectNoAxeViolations(page);
  });

  test("studio configurator (signed in) @mobile", async ({ page }) => {
    await openStudio(page, "/studio?uni=usyd&level=bachelor");
    await expect(page.getByRole("combobox", { name: "Faculty / discipline" })).toBeVisible();
    await expectNoAxeViolations(page);
  });
});
