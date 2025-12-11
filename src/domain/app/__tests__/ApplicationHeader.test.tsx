import { render, screen, userEvent, within } from "../../testingLibraryUtils";
import ApplicationHeader from "../AppHeader";

const defaultProps = {
  onHeaderHeightChange: jest.fn(),
};
const renderComponent = () => render(<ApplicationHeader {...defaultProps} />);

describe("<ApplicationHeader />", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("skip link", () => {
    it("should render skip link", () => {
      renderComponent();

      const skipLink = screen.getByRole("link", {
        name: "Siirry suoraan sisältöön",
      });
      expect(skipLink).toBeInTheDocument();
    });
  });

  describe("title", () => {
    it("should contain the application header", () => {
      renderComponent();

      const header = screen.getByRole("banner");

      expect(header).toBeInTheDocument();
    });

    it("should render application title", () => {
      renderComponent();

      const title = screen.getByRole("link", { name: "Ulkoliikuntakartta" });

      expect(title).toBeInTheDocument();
    });
  });

  describe("language controls", () => {
    it("should apply lang attribute to language controls", () => {
      renderComponent();

      const finnishButton = screen.getByText("Suomi").closest("button");
      const swedishButton = screen.getByText("Svenska").closest("button");
      const englishButton = screen.getByText("English").closest("button");

      expect(finnishButton?.getAttribute("lang")).toEqual("fi");
      expect(swedishButton?.getAttribute("lang")).toEqual("sv");
      expect(englishButton?.getAttribute("lang")).toEqual("en");
    });
  });

  describe("info dropdown", () => {
    it("should render info dropdown", () => {
      renderComponent();

      const infoButton = screen.getByRole("button", {
        name: "Tietoa palvelusta",
      });

      expect(infoButton).toBeInTheDocument();
    });

    it("should render info dropdown content when clicked", async () => {
      renderComponent();

      const infoButton = screen.getByRole("button", {
        name: "Tietoa palvelusta",
      });
      const user = userEvent.setup();
      await user.click(infoButton);

      // Get dropdown by ID
      const dropdownMenu = document.getElementById(
        "app-info-dropdown-dropdown",
      );
      expect(dropdownMenu).toBeInTheDocument();

      const withinDropdown = within(dropdownMenu!);

      const instructionsButton = withinDropdown.getByRole("button", {
        name: "Ohjeet",
      });
      expect(instructionsButton).toBeInTheDocument();

      const feedbackButton = withinDropdown.getByRole("button", {
        name: "Anna palautetta",
      });
      expect(feedbackButton).toBeInTheDocument();

      const aboutButton = withinDropdown.getByRole("button", {
        name: "Tietoa palvelusta",
      });
      expect(aboutButton).toBeInTheDocument();

      const accessibilityButton = withinDropdown.getByRole("button", {
        name: "Saavutettavuusseloste",
      });
      expect(accessibilityButton).toBeInTheDocument();

      const openMapLink = withinDropdown.getByRole("link", {
        name: "OpenStreetMap tekijät. Avaa uuden ikkunan. Siirtyy ulkopuoliseen palveluun.",
      });
      expect(openMapLink).toBeInTheDocument();
    });
  });
});
