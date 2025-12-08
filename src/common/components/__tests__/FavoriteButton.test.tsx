import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FavoriteButton from "../FavoriteButton";

describe("FavoriteButton", () => {
  const defaultProps = {
    addFavoriteText: "Add to favorites",
    removeFavoriteText: "Remove from favorites",
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders button with add text when not favorite", () => {
      render(<FavoriteButton {...defaultProps} isFavorite={false} />);

      const button = screen.getByTestId("favorite-button");
      expect(button).toBeInTheDocument();
      expect(screen.getByText("Add to favorites")).toBeInTheDocument();
    });

    it("renders button with remove text when is favorite", () => {
      render(<FavoriteButton {...defaultProps} isFavorite={true} />);

      const button = screen.getByTestId("favorite-button");
      expect(button).toBeInTheDocument();
      expect(screen.getByText("Remove from favorites")).toBeInTheDocument();
    });

    it("applies correct CSS class", () => {
      render(<FavoriteButton {...defaultProps} />);

      const button = screen.getByTestId("favorite-button");
      expect(button).toHaveClass("favorite-button");
    });
  });

  describe("icons", () => {
    it("displays empty star icon when not favorite", () => {
      render(<FavoriteButton {...defaultProps} isFavorite={false} />);

      const emptyStarIcon = screen.getByTestId("star-icon");
      expect(emptyStarIcon).toBeInTheDocument();
      expect(emptyStarIcon).toHaveAttribute("aria-label", "star");
      expect(screen.queryByTestId("star-fill-icon")).not.toBeInTheDocument();
    });

    it("displays filled star icon when is favorite", () => {
      render(<FavoriteButton {...defaultProps} isFavorite={true} />);

      const filledStarIcon = screen.getByTestId("star-fill-icon");
      expect(filledStarIcon).toBeInTheDocument();
      expect(filledStarIcon).toHaveAttribute("aria-label", "star-fill");
      expect(screen.queryByTestId("star-icon")).not.toBeInTheDocument();
    });
  });

  describe("interaction", () => {
    it("calls onClick handler when clicked", async () => {
      const mockOnClick = jest.fn();
      render(<FavoriteButton {...defaultProps} onClick={mockOnClick} />);

      const button = screen.getByTestId("favorite-button");
      const user = userEvent.setup();
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("is keyboard accessible", () => {
      render(<FavoriteButton {...defaultProps} />);

      const button = screen.getByTestId("favorite-button");
      expect(button.tagName).toBe("BUTTON");
      expect(button).toBeInTheDocument();
    });
  });

  describe("text content", () => {
    it("displays correct text based on favorite state", () => {
      const { rerender } = render(
        <FavoriteButton {...defaultProps} isFavorite={false} />,
      );

      expect(screen.getByText("Add to favorites")).toBeInTheDocument();
      expect(
        screen.queryByText("Remove from favorites"),
      ).not.toBeInTheDocument();

      rerender(<FavoriteButton {...defaultProps} isFavorite={true} />);

      expect(screen.getByText("Remove from favorites")).toBeInTheDocument();
      expect(screen.queryByText("Add to favorites")).not.toBeInTheDocument();
    });

    it("handles custom text props", () => {
      const customProps = {
        ...defaultProps,
        addFavoriteText: "Mark as favorite",
        removeFavoriteText: "Unmark favorite",
      };

      const { rerender } = render(
        <FavoriteButton {...customProps} isFavorite={false} />,
      );

      expect(screen.getByText("Mark as favorite")).toBeInTheDocument();

      rerender(<FavoriteButton {...customProps} isFavorite={true} />);

      expect(screen.getByText("Unmark favorite")).toBeInTheDocument();
    });
  });

  describe("state transitions", () => {
    it("correctly updates icon and text when transitioning from not favorite to favorite", () => {
      const { rerender } = render(
        <FavoriteButton {...defaultProps} isFavorite={false} />,
      );

      // Initial state
      expect(screen.getByText("Add to favorites")).toBeInTheDocument();
      expect(screen.getByTestId("star-icon")).toBeInTheDocument();

      // Transition to favorite
      rerender(<FavoriteButton {...defaultProps} isFavorite={true} />);

      expect(screen.getByText("Remove from favorites")).toBeInTheDocument();
      expect(screen.getByTestId("star-fill-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("star-icon")).not.toBeInTheDocument();
    });

    it("correctly updates icon and text when transitioning from favorite to not favorite", () => {
      const { rerender } = render(
        <FavoriteButton {...defaultProps} isFavorite={true} />,
      );

      // Initial state
      expect(screen.getByText("Remove from favorites")).toBeInTheDocument();
      expect(screen.getByTestId("star-fill-icon")).toBeInTheDocument();

      // Transition to not favorite
      rerender(<FavoriteButton {...defaultProps} isFavorite={false} />);

      expect(screen.getByText("Add to favorites")).toBeInTheDocument();
      expect(screen.getByTestId("star-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("star-fill-icon")).not.toBeInTheDocument();
    });
  });
});
