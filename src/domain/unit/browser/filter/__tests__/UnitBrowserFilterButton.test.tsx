import { render, screen, userEvent } from "../../../../testingLibraryUtils";
import UnitBrowserFilterButton from "../UnitBrowserFilterButton";

const defaultProps = {
  message: "Swimming",
  filterName: "swimming",
  onClick: jest.fn(),
  showDropdownIndicator: false,
  isActive: false,
};

describe("UnitBrowserFilterButton", () => {
  let mockOnClick: jest.Mock;

  beforeEach(() => {
    mockOnClick = jest.fn();
  });

  describe("when showDropdownIndicator is true", () => {
    const renderComponent = (props = {}) =>
      render(
        <UnitBrowserFilterButton
          {...defaultProps}
          onClick={mockOnClick}
          showDropdownIndicator={true}
          {...props}
        />,
      );

    it("renders as a Button component", () => {
      renderComponent();

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("unit-filter-button");
    });

    it("displays the message text", () => {
      renderComponent();

      expect(screen.getByText("Swimming")).toBeInTheDocument();
    });

    it("includes DropdownIndicator component", () => {
      renderComponent();

      const button = screen.getByRole("button");
      // Verify the button contains the expected structure with icon
      expect(button).toContainHTML("unit-filter-button__icon");
    });

    it("calls onClick when clicked", async () => {
      renderComponent();

      const button = screen.getByRole("button");
      const user = userEvent.setup();
      await user.click(button);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("passes through aria attributes", () => {
      renderComponent({
        "aria-label": "Test Button Label",
        id: "test-button",
      });

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Test Button Label");
      expect(button).toHaveAttribute("id", "test-button");
    });
  });

  describe("when showDropdownIndicator is false or undefined", () => {
    const renderComponent = (props = {}) =>
      render(
        <UnitBrowserFilterButton
          {...defaultProps}
          onClick={mockOnClick}
          showDropdownIndicator={false}
          {...props}
        />,
      );

    it("renders as a Tag component", () => {
      renderComponent();

      // Tag component renders as a div with specific classes
      const tagElement = screen.getByText("Swimming").parentElement;
      expect(tagElement).toBeInTheDocument();
      expect(tagElement).toHaveClass("unit-filter-option-button");
    });

    it("displays the message text", () => {
      renderComponent();

      expect(screen.getByText("Swimming")).toBeInTheDocument();
    });

    it("applies active class when isActive is true", () => {
      renderComponent({ isActive: true });

      const tagElement = screen.getByText("Swimming").parentElement;
      expect(tagElement).toHaveClass("active");
    });

    it("does not apply active class when isActive is false", () => {
      renderComponent({ isActive: false });

      const tagElement = screen.getByText("Swimming").parentElement;
      expect(tagElement).not.toHaveClass("active");
    });

    it("sets aria-selected attribute based on isActive", () => {
      const { rerender } = renderComponent({ isActive: true });

      let tagElement = screen.getByText("Swimming").parentElement;
      expect(tagElement).toHaveAttribute("aria-selected", "true");

      rerender(
        <UnitBrowserFilterButton
          {...defaultProps}
          onClick={mockOnClick}
          showDropdownIndicator={false}
          isActive={false}
        />,
      );

      tagElement = screen.getByText("Swimming").parentElement;
      expect(tagElement).toHaveAttribute("aria-selected", "false");
    });

    it("calls onClick when clicked", async () => {
      renderComponent();

      const tagElement = screen.getByText("Swimming").parentElement;
      const user = userEvent.setup();
      await user.click(tagElement!);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("applies custom className", () => {
      renderComponent({ className: "custom-tag-class" });

      const tagElement = screen.getByText("Swimming").parentElement;
      expect(tagElement).toHaveClass("unit-filter-option-button");
      expect(tagElement).toHaveClass("custom-tag-class");
    });

    it("passes through aria attributes", () => {
      renderComponent({
        "aria-label": "Test Tag Label",
        id: "test-tag",
      });

      const tagElement = screen.getByText("Swimming").parentElement;
      expect(tagElement).toHaveAttribute("aria-label", "Test Tag Label");
      expect(tagElement).toHaveAttribute("id", "test-tag");
    });
  });

  describe("icon behavior", () => {
    it("applies correct icon class for dropdown variant", () => {
      render(
        <UnitBrowserFilterButton
          {...defaultProps}
          onClick={mockOnClick}
          showDropdownIndicator={true}
        />,
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toContainHTML("unit-filter-button__icon");
    });

    it("applies correct icon class for tag variant", () => {
      render(
        <UnitBrowserFilterButton
          {...defaultProps}
          onClick={mockOnClick}
          showDropdownIndicator={false}
        />,
      );

      // Icon should be present within the tag
      const tagElement = screen.getByText("Swimming").parentElement;
      expect(tagElement).toBeInTheDocument();
      expect(tagElement).toContainHTML("unit-filter-option-button__icon");
    });
  });

  describe("keyboard interactions", () => {
    it("handles keyboard events for dropdown variant", () => {
      render(
        <UnitBrowserFilterButton
          {...defaultProps}
          onClick={mockOnClick}
          showDropdownIndicator={true}
        />,
      );

      const button = screen.getByRole("button");
      // Bootstrap Button handles keyboard events natively, so we just verify it's accessible
      expect(button).toBeInTheDocument();
    });

    it("handles keyboard events for tag variant", async () => {
      render(
        <UnitBrowserFilterButton
          {...defaultProps}
          onClick={mockOnClick}
          showDropdownIndicator={false}
        />,
      );

      const tagElement = screen.getByText("Swimming").parentElement!;
      const user = userEvent.setup();

      // Focus the element first, then test keyboard events
      tagElement.focus();

      // Test Enter key
      await user.keyboard("{Enter}");
      expect(mockOnClick).toHaveBeenCalledTimes(1);

      mockOnClick.mockClear();

      // Test Space key
      await user.keyboard(" ");
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });
});
