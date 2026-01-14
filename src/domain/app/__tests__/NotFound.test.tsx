import { render, screen, userEvent } from "../../testingLibraryUtils";
import NotFound from "../NotFound";

// Mock the history hook
const mockPush = vi.fn();
const mockGoBack = vi.fn();

vi.mock("react-router-dom", async () => ({
  ...await vi.importActual("react-router-dom"),
  useHistory: () => ({
    push: mockPush,
    goBack: mockGoBack,
  }),
}));

// Mock the useLanguage hook
const mockUseLanguage = vi.fn();
vi.mock("../../../common/hooks/useLanguage", () => ({
  __esModule: true,
  default: () => mockUseLanguage(),
}));

describe("<NotFound />", () => {
  beforeEach(() => {
    mockUseLanguage.mockReturnValue("fi");
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("content rendering", () => {
    it("should render 404 title", () => {
      render(<NotFound />);

      const title = screen.getByRole("heading", { level: 1, name: "404" });
      expect(title).toBeInTheDocument();
    });

    it("should render translated title and description", () => {
      render(<NotFound />);

      const subtitle = screen.getByRole("heading", { level: 2 });
      const description = screen.getByText(/hakemaasi sivua ei löytynyt/i);

      expect(subtitle).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });

    it("should render go home button", () => {
      render(<NotFound />);

      const goHomeButton = screen.getByRole("button", {
        name: /palaa etusivulle/i,
      });
      expect(goHomeButton).toBeInTheDocument();
    });
  });

  describe("navigation functionality", () => {
    it("should navigate to home when go home button is clicked", async () => {
      const user = userEvent.setup();
      render(<NotFound />);

      const goHomeButton = screen.getByRole("button", {
        name: /palaa etusivulle/i,
      });

      await user.click(goHomeButton);

      expect(mockPush).toHaveBeenCalledWith("/fi/");
    });

    it.each([
      { language: "sv", expectedPath: "/sv/" },
      { language: "en", expectedPath: "/en/" },
    ])("should navigate to correct language home page for $language", async ({ language, expectedPath }) => {
      mockUseLanguage.mockReturnValue(language);
      const user = userEvent.setup();
      render(<NotFound />);

      // The button text is still in Finnish due to test environment,
      // but the navigation should use the correct language code
      const goHomeButton = screen.getByRole("button", {
        name: /palaa etusivulle/i,
      });

      await user.click(goHomeButton);

      expect(mockPush).toHaveBeenCalledWith(expectedPath);
    });
  });

  describe("accessibility", () => {
    it("should have proper page title", () => {
      render(<NotFound />);

      // Page component should set the title
      expect(document.title).toContain("Sivua ei löytynyt");
    });

    it("should have proper heading structure", () => {
      render(<NotFound />);

      const h1 = screen.getByRole("heading", { level: 1 });
      const h2 = screen.getByRole("heading", { level: 2 });

      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
      expect(h1.textContent).toBe("404");
    });

    it("should have aria-hidden on home icon", () => {
      render(<NotFound />);

      const homeIcon = screen.getByRole("button").querySelector("svg");
      expect(homeIcon).toHaveAttribute("aria-hidden", "true");
    });
  });
});