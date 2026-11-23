import { expect, test } from "@playwright/test";
import { openStudio } from "./helpers";

test.describe("Studio configurator", () => {
  test("picking a university and level updates the preview and the shareable URL @mobile", async ({
    page,
  }) => {
    await openStudio(page);
    const preview = page.getByRole("region", { name: "3D regalia preview" });

    await page.getByRole("button", { name: /Monash/ }).click();
    await page.getByRole("button", { name: "Masters" }).click();

    await expect(page.getByRole("button", { name: /Monash/ })).toHaveAttribute("aria-pressed", "true");
    await expect(preview.getByText("Monash · Masters")).toBeVisible();
    await expect(page).toHaveURL(/uni=monash/);
    await expect(page).toHaveURL(/level=masters/);
  });

  test("the 3D canvas renders with a descriptive label", async ({ page }) => {
    await openStudio(page, "/studio?uni=unsw&level=phd");
    const viewer = page.getByLabel("3D preview of UNSW PhD regalia");
    await expect(viewer).toBeVisible();
    await expect(viewer.locator("canvas")).toHaveAttribute("data-engine", /three\.js/);
  });

  test("choosing a faculty is reflected in the URL and survives a reload", async ({ page }) => {
    // Sydney bachelor hoods vary by faculty (see src/data/facultyColors.ts).
    await openStudio(page);
    await page.getByRole("button", { name: /Sydney/ }).click();

    const faculty = page.getByRole("combobox", { name: "Faculty / discipline" });
    await expect(faculty.getByRole("option", { name: "Law (LLB)" })).toBeAttached();
    await faculty.selectOption({ label: "Law (LLB)" });
    await expect(page).toHaveURL(/uni=usyd/);
    await expect(page).toHaveURL(/faculty=law/);

    await page.reload();
    await expect(page.getByRole("combobox", { name: "Faculty / discipline" })).toHaveValue("law");
  });

  test("saved looks persist across reloads and can be removed", async ({ page }) => {
    await openStudio(page);

    await page.getByRole("button", { name: /UWA/ }).click();
    await page.getByRole("button", { name: "Save this look" }).click();
    await expect(page.getByRole("button", { name: "Look saved ✓" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "UWA Bachelor", exact: true })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("button", { name: "UWA Bachelor", exact: true })).toBeVisible();

    // Switch away, then restore the look from its chip.
    await page.getByRole("button", { name: /ANU/ }).click();
    await page.getByRole("button", { name: "UWA Bachelor", exact: true }).click();
    await expect(page.getByRole("button", { name: /UWA/ }).first()).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await page.getByRole("button", { name: "Remove UWA Bachelor" }).click();
    await expect(page.getByRole("button", { name: "UWA Bachelor", exact: true })).toHaveCount(0);
  });

  test("saving right after switching university uses the new university's name", async ({
    page,
  }) => {
    await openStudio(page);
    // Slow the regalia API down like a real network, so the preview lags the click.
    await page.route("**/api/regalia**", async (route) => {
      await new Promise((r) => setTimeout(r, 800));
      await route.continue();
    });

    await page.getByRole("button", { name: /UWA/ }).click();
    await expect(page.getByRole("button", { name: "Save this look" })).toBeDisabled();
    await page.getByRole("button", { name: "Save this look" }).click();

    await expect(page.getByRole("button", { name: "UWA Bachelor", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "ANU Bachelor", exact: true })).toHaveCount(0);
  });

  test("mannequin options update the shareable URL", async ({ page }) => {
    await openStudio(page);
    await page.getByRole("button", { name: "Men's", exact: true }).click();
    await expect(page.getByRole("button", { name: "Men's", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page).toHaveURL(/build=male/);
  });

  test("share link copies the current look to the clipboard", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await openStudio(page, "/studio?uni=adelaide&level=masters");

    await page.getByRole("button", { name: "Share link" }).click();
    await expect(page.getByRole("status")).toHaveText(/Link copied/);
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain("uni=adelaide");
    expect(copied).toContain("level=masters");
  });
});

test.describe("Studio keyboard access", () => {
  test("the whole configurator can be driven from the keyboard", async ({ page }) => {
    await openStudio(page);

    // University buttons are reachable with Tab and activate with Enter / Space.
    const uq = page.getByRole("button", { name: /UQ/ });
    await uq.focus();
    await page.keyboard.press("Enter");
    await expect(uq).toHaveAttribute("aria-pressed", "true");

    const phd = page.getByRole("button", { name: "PhD" });
    await phd.focus();
    await page.keyboard.press("Space");
    await expect(phd).toHaveAttribute("aria-pressed", "true");
    await expect(page).toHaveURL(/uni=uq&level=phd/);
  });

  test("the 3D viewer orbits and zooms with arrow and +/- keys", async ({ page }) => {
    await openStudio(page);
    const viewer = page.getByRole("group", { name: /3D preview of ANU Bachelor regalia/ });
    const status = page.getByTestId("viewer-announcement");

    // Stop the turntable so readings are stable.
    await page.getByRole("button", { name: "Pause rotation" }).click();
    await expect(page.getByRole("button", { name: "Resume rotation" })).toBeVisible();

    // Keys are no-ops until three.js has created the canvas and controls.
    await expect(viewer.locator("canvas")).toHaveAttribute("data-engine", /three\.js/);
    await viewer.focus();
    await expect(viewer).toBeFocused();

    await page.keyboard.press("ArrowRight");
    await expect(status).toHaveText(/Rotation \d+ degrees, tilt \d+ degrees, zoom \d+ percent/);
    const first = (await status.textContent())!;
    await page.keyboard.press("ArrowRight");
    await expect(status).not.toHaveText(first);

    const zoom = async () => Number((await status.textContent())!.match(/zoom (\d+)/)![1]);
    const before = await zoom();
    await page.keyboard.press("+");
    await page.keyboard.press("+");
    await expect.poll(zoom).toBeGreaterThan(before);
    await page.keyboard.press("-");
    await page.keyboard.press("-");
    await page.keyboard.press("-");
    await expect.poll(zoom).toBeLessThan(before);

    // Arrow keys must not scroll the page while the viewer is focused.
    const scrollY = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("ArrowDown");
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
  });

  test("auto-rotate is off for visitors who prefer reduced motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await openStudio(page);
    await expect(page.getByRole("button", { name: "Resume rotation" })).toBeVisible();
    await context.close();
  });
});
