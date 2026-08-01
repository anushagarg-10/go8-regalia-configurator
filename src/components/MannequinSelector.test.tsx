/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MannequinSelector from "./MannequinSelector";
import { DEFAULT_MANNEQUIN, SKIN_TONES } from "@/lib/mannequin";

describe("MannequinSelector", () => {
  it("renders both builds and all skin tones", () => {
    render(<MannequinSelector config={DEFAULT_MANNEQUIN} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Women's" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Men's" })).toHaveAttribute("aria-pressed", "false");
    for (const tone of SKIN_TONES) {
      expect(screen.getByRole("button", { name: `${tone.name} skin tone` })).toBeInTheDocument();
    }
  });

  it("notifies on build and skin tone changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MannequinSelector config={DEFAULT_MANNEQUIN} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Men's" }));
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_MANNEQUIN, build: "male" });

    await user.click(screen.getByRole("button", { name: "Deep skin tone" }));
    expect(onChange).toHaveBeenCalledWith({
      ...DEFAULT_MANNEQUIN,
      skinTone: SKIN_TONES[3].hex,
    });
  });
});
