import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import { render, screen } from "../../../domain/testingLibraryUtils";
import BackLink from "../BackLink";

// Mock the useLanguage hook
vi.mock("../../hooks/useLanguage", () => ({
  __esModule: true,
  default: () => "fi",
}));

// Mock HDS IconArrowLeft
vi.mock("hds-react", () => ({
  IconArrowLeft: function MockIconArrowLeft(props: any) {
    return (
      <span data-testid="arrow-left-icon" {...props}>
        ←
      </span>
    );
  },
}));

function renderWithRouter(
  component: React.ReactElement,
  { route = "/", state }: { route?: string; state?: any } = {},
) {
  const history = createMemoryHistory({
    initialEntries: [{ pathname: route, state }],
  });
  return {
    ...render(<Router history={history}>{component}</Router>),
    history,
  };
}

describe("BackLink", () => {
  const defaultProps = {
    label: "Back to previous page",
  };

  describe("rendering", () => {
    it("renders back link with correct label", () => {
      renderWithRouter(<BackLink {...defaultProps} />);

      const link = screen.getByRole("link", { name: "Back to previous page" });
      expect(link).toBeInTheDocument();
      expect(screen.getByText("Back to previous page")).toBeInTheDocument();
    });

    it("renders arrow icon", () => {
      renderWithRouter(<BackLink {...defaultProps} />);

      const icon = screen.getByTestId("arrow-left-icon");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("applies default CSS classes", () => {
      renderWithRouter(<BackLink {...defaultProps} />);

      const link = screen.getByRole("link");
      expect(link).toHaveClass("back-link");
    });

    it("applies custom className when provided", () => {
      renderWithRouter(<BackLink {...defaultProps} className="custom-class" />);

      const link = screen.getByRole("link");
      expect(link).toHaveClass("back-link");
      expect(link).toHaveClass("custom-class");
    });

    it("renders label with correct class", () => {
      renderWithRouter(<BackLink {...defaultProps} />);

      const label = screen.getByText("Back to previous page");
      expect(label).toHaveClass("back-link-label");
    });
  });

  describe("navigation", () => {
    it("navigates to root path when no previous state", () => {
      const { history } = renderWithRouter(<BackLink {...defaultProps} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/fi/");

      // Verify the link would navigate to the expected path
      expect(history.location.pathname).toBe("/");
    });

    it("navigates to previous path when available in location state", () => {
      const previousPath = "/search/results";
      renderWithRouter(<BackLink {...defaultProps} />, {
        route: "/unit/123",
        state: { previous: previousPath },
      });

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/fi/search/results");
    });
  });

  describe("accessibility", () => {
    it("has proper link semantics", () => {
      renderWithRouter(<BackLink {...defaultProps} />);

      const link = screen.getByRole("link");
      expect(link.tagName).toBe("A");
    });

    it("has accessible label text", () => {
      renderWithRouter(<BackLink {...defaultProps} />);

      const link = screen.getByRole("link", { name: "Back to previous page" });
      expect(link).toBeInTheDocument();
    });

    it("icon is properly hidden from screen readers", () => {
      renderWithRouter(<BackLink {...defaultProps} />);

      const icon = screen.getByTestId("arrow-left-icon");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });
});
