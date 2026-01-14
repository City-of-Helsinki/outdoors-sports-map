import { render, screen } from "../../../domain/testingLibraryUtils";
import DropdownIndicator from "../DropdownIndicator";

describe("DropdownIndicator", () => {
  it("renders with default state", () => {
    render(<DropdownIndicator />);

    const indicator = screen.getByTestId("dropdown-indicator");
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass("dropdown-indicator");
    expect(indicator).not.toHaveClass("active");
    expect(indicator).toHaveAttribute("aria-hidden", "true");
  });

  it("applies active class when isActive is true", () => {
    render(<DropdownIndicator isActive={true} />);

    const indicator = screen.getByTestId("dropdown-indicator");
    expect(indicator).toHaveClass("dropdown-indicator", "active");
  });

  it("renders icon component", () => {
    render(<DropdownIndicator />);

    const icon = screen.getByLabelText("angle-down");
    expect(icon).toBeInTheDocument();
  });
});
