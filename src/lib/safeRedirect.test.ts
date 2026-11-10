import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "@/lib/safeRedirect";

describe("safeRedirectPath", () => {
  it("keeps same-origin paths, including shared-look query strings", () => {
    expect(safeRedirectPath("/studio")).toBe("/studio");
    expect(safeRedirectPath("/studio?uni=uq&level=masters")).toBe("/studio?uni=uq&level=masters");
  });

  it("falls back when there is no destination", () => {
    expect(safeRedirectPath(null)).toBe("/studio");
    expect(safeRedirectPath("")).toBe("/studio");
    expect(safeRedirectPath(undefined, "/")).toBe("/");
  });

  it("blocks links that leave the site", () => {
    expect(safeRedirectPath("//evil.com")).toBe("/studio");
    expect(safeRedirectPath("/\\evil.com")).toBe("/studio");
    expect(safeRedirectPath("https://evil.com")).toBe("/studio");
    expect(safeRedirectPath("javascript:alert(1)")).toBe("/studio");
  });
});
