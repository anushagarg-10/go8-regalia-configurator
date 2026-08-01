/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegaliaSelector from "./RegaliaSelector";
import { listUniversities } from "@/lib/regalia";

function renderSelector(overrides: Partial<Parameters<typeof RegaliaSelector>[0]> = {}) {
  const props = {
    universities: listUniversities(),
    selectedUniversityId: "anu",
    selectedLevel: "bachelor" as const,
    onUniversityChange: vi.fn(),
    onLevelChange: vi.fn(),
    ...overrides,
  };
  render(<RegaliaSelector {...props} />);
  return props;
}

describe("RegaliaSelector", () => {
  it("renders a button for each of the eight universities", () => {
    renderSelector();
    for (const shortName of ["ANU", "Sydney", "Melbourne", "UQ", "UWA", "Adelaide", "Monash", "UNSW"]) {
      expect(screen.getByRole("button", { name: new RegExp(shortName) })).toBeInTheDocument();
    }
  });

  it("marks the selected university and level as pressed", () => {
    renderSelector({ selectedUniversityId: "monash", selectedLevel: "phd" });
    expect(screen.getByRole("button", { name: /Monash/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /ANU/ })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "PhD" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Bachelor" })).toHaveAttribute("aria-pressed", "false");
  });

  it("notifies on university and level selection", async () => {
    const user = userEvent.setup();
    const props = renderSelector();

    await user.click(screen.getByRole("button", { name: /UNSW/ }));
    expect(props.onUniversityChange).toHaveBeenCalledWith("unsw");

    await user.click(screen.getByRole("button", { name: "PhD" }));
    expect(props.onLevelChange).toHaveBeenCalledWith("phd");
  });
});
