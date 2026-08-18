import userEvent from "@testing-library/user-event";

import { render, screen } from "../../testingLibraryUtils";
import SizeInput from "../SizeInput";

describe("SizeInput", () => {
  const defaultProps = {
    id: "embed-width",
    label: "Width",
    value: "100",
    onChange: vi.fn(),
  };

  it("renders with label and value", () => {
    render(<SizeInput {...defaultProps} />);
    expect(screen.getByRole("spinbutton", { name: "Width" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
  });

  it("calls onChange when user types", async () => {
    const onChange = vi.fn();
    render(<SizeInput {...defaultProps} value="" onChange={onChange} />);
    await userEvent.setup().type(screen.getByRole("spinbutton"), "200");
    expect(onChange).toHaveBeenCalled();
  });

  it("renders different label and value", () => {
    render(<SizeInput {...defaultProps} id="embed-height" label="Height (px)" value="600" />);
    expect(screen.getByRole("spinbutton", { name: "Height (px)" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("600")).toBeInTheDocument();
  });

  it("renders the unit suffix when the unit prop is provided", () => {
    render(<SizeInput {...defaultProps} unit="px" />);
    expect(screen.getByText("px")).toBeInTheDocument();
  });

  it("does not render a unit suffix when unit prop is absent", () => {
    render(<SizeInput {...defaultProps} />);
    // No element other than the input should appear
    expect(screen.queryByText("px")).not.toBeInTheDocument();
    expect(screen.queryByText("%")).not.toBeInTheDocument();
  });

  it("the unit suffix is hidden from assistive technology", () => {
    render(<SizeInput {...defaultProps} unit="%" />);
    expect(screen.getByText("%")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders a numeric input", () => {
    render(<SizeInput {...defaultProps} />);
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("type", "number");
    expect(input).toHaveAttribute("inputmode", "numeric");
    expect(input).toHaveAttribute("pattern", "[0-9]*");
  });
});
