import userEvent from "@testing-library/user-event";
import { ButtonVariant } from "hds-react";

import { render, screen } from "../../../domain/testingLibraryUtils";
import CloseButton from "../CloseButton";

function MockIcon() {
  return <span data-testid="mock-icon" />;
}

describe("CloseButton", () => {
  const defaultProps = {
    label: "Close",
    onClick: vi.fn(),
  };

  it("renders with label", () => {
    render(<CloseButton {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<CloseButton label="Close" onClick={onClick} />);
    await userEvent.setup().click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders icon when iconStart is provided", () => {
    render(<CloseButton {...defaultProps} iconStart={<MockIcon />} />);
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  it("applies custom style", () => {
    render(<CloseButton {...defaultProps} style={{ position: "absolute", top: "8px" }} />);
    const button = screen.getByRole("button");
    expect(button).toHaveStyle({ position: "absolute", top: "8px" });
  });

  it("uses supplementary variant when specified", () => {
    render(<CloseButton {...defaultProps} variant={ButtonVariant.Supplementary} />);
    const button = screen.getByRole("button");
    expect(button.className).toMatch(/supplementary/i); 
  });
});
