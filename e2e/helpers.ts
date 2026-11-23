import { expect, type Page } from "@playwright/test";

export const TEST_PASSWORD = "e2e-test-password";

/** A unique demo account per test, so parallel workers never collide. */
export function uniqueEmail(prefix = "grad"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.edu.au`;
}

/**
 * Creates a demo account through the real sign-up form and waits until the
 * app has redirected to `next` (the studio by default).
 */
export async function signUp(
  page: Page,
  { name = "Test Graduate", email = uniqueEmail(), next = "/studio" } = {},
): Promise<{ name: string; email: string }> {
  await page.goto(`/login?mode=signup&next=${encodeURIComponent(next)}`);
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Create my account" }).click();
  await expect(page).toHaveURL(new RegExp(`${next.split("?")[0]}`));
  return { name, email };
}

/** Signs up and waits for the configurator controls to finish loading. */
export async function openStudio(page: Page, next = "/studio") {
  const account = await signUp(page, { next });
  await expect(page.getByRole("heading", { name: /Welcome back/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /ANU/ })).toBeVisible();
  return account;
}
