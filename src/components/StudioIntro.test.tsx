/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import StudioIntro from "./StudioIntro";

// No app router in jsdom; the component only needs these two hooks.
vi.mock("next/navigation", () => ({
  usePathname: () => "/studio",
  useRouter: () => ({ push: vi.fn() }),
}));
import { signUp } from "@/lib/auth";

beforeEach(() => {
  window.localStorage.clear();
});

describe("StudioIntro", () => {
  it("lets signed-out visitors straight into the studio as a guest", () => {
    render(
      <StudioIntro>
        <p>the studio</p>
      </StudioIntro>,
    );
    expect(screen.getByText("the studio")).toBeInTheDocument();
    expect(screen.getByText(/no sign-up needed/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /create free account/i }).getAttribute("href"),
    ).toMatch(/^\/login\?mode=signup&next=/);
  });

  it("welcomes signed-in users by name without the guest prompt", async () => {
    await signUp("grad@uni.edu.au", "password123", "Grad");
    render(
      <StudioIntro>
        <p>the studio</p>
      </StudioIntro>,
    );
    expect(await screen.findByText("the studio")).toBeInTheDocument();
    expect(screen.getByText("Grad")).toBeInTheDocument();
    expect(screen.queryByText(/no sign-up needed/i)).not.toBeInTheDocument();
  });
});
