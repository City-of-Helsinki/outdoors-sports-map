import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import EmbedRadioGroup from "../EmbedRadioGroup";

const OPTIONS = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C" },
] as const;

describe("EmbedRadioGroup", () => {
  it("renders one radio button per option", () => {
    render(<EmbedRadioGroup name="test" options={OPTIONS} value="a" onChange={() => {}} />);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("labels each radio button with its option label", () => {
    render(<EmbedRadioGroup name="test" options={OPTIONS} value="a" onChange={() => {}} />);
    expect(screen.getByLabelText("Option A")).toBeInTheDocument();
    expect(screen.getByLabelText("Option B")).toBeInTheDocument();
    expect(screen.getByLabelText("Option C")).toBeInTheDocument();
  });

  it("checks only the radio matching the current value", () => {
    render(<EmbedRadioGroup name="test" options={OPTIONS} value="b" onChange={() => {}} />);
    expect(screen.getByLabelText("Option A")).not.toBeChecked();
    expect(screen.getByLabelText("Option B")).toBeChecked();
    expect(screen.getByLabelText("Option C")).not.toBeChecked();
  });

  it("derives id as name-value for each option", () => {
    render(<EmbedRadioGroup name="my-group" options={OPTIONS} value="a" onChange={() => {}} />);
    expect(document.getElementById("my-group-a")).toBeInTheDocument();
    expect(document.getElementById("my-group-b")).toBeInTheDocument();
  });

  it("calls onChange with the selected value when a radio is clicked", async () => {
    const onChange = vi.fn();
    render(<EmbedRadioGroup name="test" options={OPTIONS} value="a" onChange={onChange} />);
    await userEvent.click(screen.getByLabelText("Option C"));
    expect(onChange).toHaveBeenCalledWith("c");
  });
});
