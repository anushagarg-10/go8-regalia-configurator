/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MannequinSelector from "./MannequinSelector";
import { DEFAULT_MANNEQUIN, FINISHES } from "@/lib/mannequin";

describe("MannequinSelector", () => {
  it("renders both builds and all finishes", () => {
    render(<MannequinSelector config={DEFAULT_MANNEQUIN} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Women's" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Men's" })).toHaveAttribute("aria-pressed", "false");
    for (const finish of FINISHES) {
      expect(screen.getByRole("button", { name: `${finish.name} finish` })).toBeInTheDocument();
    }
    expect(screen.getByRole("button", { name: "Studio white finish" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("notifies on build and finish changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MannequinSelector config={DEFAULT_MANNEQUIN} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Men's" }));
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_MANNEQUIN, build: "male" });

    await user.click(screen.getByRole("button", { name: "Deep finish" }));
    expect(onChange).toHaveBeenCalledWith({
      ...DEFAULT_MANNEQUIN,
      finish: FINISHES[4].hex,
    });
  });
});
