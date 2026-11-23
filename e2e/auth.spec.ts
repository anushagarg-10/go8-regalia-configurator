import { expect, test } from "@playwright/test";
import { signUp, TEST_PASSWORD, uniqueEmail } from "./helpers";

test.describe("Graduate portal", () => {
  test("the studio is gated for signed-out visitors @mobile", async ({ page }) => {
    await page.goto("/studio?uni=uq&level=phd");

    await expect(
      page.getByRole("heading", { name: "The studio is behind the velvet rope" }),
    ).toBeVisible();

    // Both calls to action carry the full shared-look URL through login.
    const createLink = page.getByRole("link", { name: "Create free account" });
    await expect(createLink).toHaveAttribute(
      "href",
      `/login?mode=signup&next=${encodeURIComponent("/studio?uni=uq&level=phd")}`,
    );
  });

  test("signing up lands in the studio and keeps a shared look @mobile", async ({ page }) => {
    await signUp(page, { name: "Priya", next: "/studio?uni=uq&level=phd" });

    await expect(page.getByRole("heading", { name: /Welcome back,\s*Priya/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /UQ/ })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: "PhD" })).toHaveAttribute("aria-pressed", "true");
  });

  test("sign in rejects unknown accounts and wrong passwords", async ({ page }) => {
    const { email } = await signUp(page);
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page.getByRole("link", { name: "Create free account" })).toBeVisible();

    await page.goto("/login");
    await page.getByLabel("Email").fill(uniqueEmail("nobody"));
    await page.getByLabel("Password").fill(TEST_PASSWORD);
    await page.locator("form").getByRole("button", { name: "Sign in" }).click();
    await expect(page.locator("form").getByRole("alert")).toHaveText(/No account found/);

    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("not-the-password");
    await page.locator("form").getByRole("button", { name: "Sign in" }).click();
    await expect(page.locator("form").getByRole("alert")).toHaveText(/Incorrect password/);

    await page.getByLabel("Password").fill(TEST_PASSWORD);
    await page.locator("form").getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/studio/);
    await expect(page.getByRole("heading", { name: /Welcome back/ })).toBeVisible();
  });

  test("sign-up validates the password length", async ({ page }) => {
    await page.goto("/login?mode=signup");
    await page.getByLabel("Email").fill(uniqueEmail());
    await page.getByLabel("Password").fill("short");
    await page.getByRole("button", { name: "Create my account" }).click();
    await expect(page.locator("form").getByRole("alert")).toHaveText(/at least 8 characters/);
  });

  for (const next of ["https://evil.example.com", "//evil.example.com"]) {
    test(`an off-site ?next=${next} falls back to the studio`, async ({ page, baseURL }) => {
      await page.goto(`/login?mode=signup&next=${encodeURIComponent(next)}`);
      await page.getByLabel("Email").fill(uniqueEmail());
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Create my account" }).click();
      // Same origin as the app under test (local or deployed), never evil.example.com.
      await expect(page).toHaveURL(/\/studio\?/);
      expect(new URL(page.url()).origin).toBe(new URL(baseURL!).origin);
    });
  }
});
