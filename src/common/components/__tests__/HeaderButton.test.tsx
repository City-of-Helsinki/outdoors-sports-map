import userEvent from "@testing-library/user-event";

import { render, screen } from "../../../domain/testingLibraryUtils";
import HeaderButton from "../HeaderButton";


// Mock icon component for testing
function MockIcon() {
  return <span data-testid="mock-icon">Icon</span>;
}

describe("HeaderButton", () => {
  const defaultProps = {
    label: "Test Button",
  };

  describe("rendering", () => {
    it("renders button with correct label", () => {
      render(<HeaderButton {...defaultProps} />);

      const button = screen.getByRole("button", { name: "Test Button" });
      expect(button).toBeInTheDocument();
      expect(screen.getByText("Test Button")).toBeInTheDocument();
    });

    it("renders with icon when provided", () => {
      render(<HeaderButton {...defaultProps} icon={<MockIcon />} />);

      expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
      expect(screen.getByText("Test Button")).toBeInTheDocument();
    });

    it("renders without icon when not provided", () => {
      render(<HeaderButton {...defaultProps} />);

      expect(screen.queryByTestId("mock-icon")).not.toBeInTheDocument();
      expect(screen.getByText("Test Button")).toBeInTheDocument();
    });
  });

  describe("interaction", () => {
    it("calls onClick handler when clicked", async () => {
      const mockOnClick = vi.fn();
      render(<HeaderButton {...defaultProps} onClick={mockOnClick} />);

      const button = screen.getByRole("button");
      const user = userEvent.setup();
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when button is disabled", async() => {
      const mockOnClick = vi.fn();
      render(<HeaderButton {...defaultProps} onClick={mockOnClick} disabled />);

      const button = screen.getByRole("button");
      const user = userEvent.setup();
      await user.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it("is keyboard accessible", () => {
      render(<HeaderButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button.tagName).toBe("BUTTON");
      expect(button).toBeInTheDocument();
    });
  });

  describe("HTML attributes", () => {
    it("passes through additional HTML button attributes", () => {
      render(
        <HeaderButton
          {...defaultProps}
          id="test-button"
          disabled
          type="submit"
          aria-label="Custom aria label"
          title="Tooltip text"
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("id", "test-button");
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveAttribute("aria-label", "Custom aria label");
      expect(button).toHaveAttribute("title", "Tooltip text");
    });

    it("maintains header-button class even with custom className", () => {
      render(<HeaderButton {...defaultProps} className="custom-class" />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("header-button");
      expect(button).toHaveClass("custom-class");
    });

    it("handles aria-expanded attribute", () => {
      render(<HeaderButton {...defaultProps} aria-expanded={true} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-expanded", "true");
    });

    it("handles aria-controls attribute", () => {
      render(<HeaderButton {...defaultProps} aria-controls="panel-id" />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-controls", "panel-id");
    });
  });
});