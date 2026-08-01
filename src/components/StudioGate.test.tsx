/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import StudioGate from "./StudioGate";
import { signUp } from "@/lib/auth";

beforeEach(() => {
  window.localStorage.clear();
});

describe("StudioGate", () => {
  it("shows the members-only prompt when signed out", () => {
    render(
      <StudioGate>
        <p>secret studio</p>
      </StudioGate>,
    );
    expect(screen.getByText(/behind the velvet rope/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /create free account/i })).toHaveAttribute(
      "href",
      "/login?mode=signup",
    );
    expect(screen.queryByText("secret studio")).not.toBeInTheDocument();
  });

  it("renders the studio with a welcome for signed-in users", async () => {
    await signUp("grad@uni.edu.au", "password123", "Grad");
    render(
      <StudioGate>
        <p>secret studio</p>
      </StudioGate>,
    );
    expect(await screen.findByText("secret studio")).toBeInTheDocument();
    expect(screen.getByText("Grad")).toBeInTheDocument();
    expect(screen.queryByText(/velvet rope/i)).not.toBeInTheDocument();
  });
});
