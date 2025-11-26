import { render, screen } from "../../testingLibraryUtils";
import ApplicationHeader from "../AppHeader";

const defaultProps = {
  toggleExpand: () => {},
  isExpanded: false,
};
const renderComponent = () => render(<ApplicationHeader {...defaultProps} />);

describe("<ApplicationHeader />", () => {
  describe("title", () => {
    it("should contain the application header", () => {
      renderComponent();
      
      const header = screen.getByRole("banner");

      expect(header).toBeInTheDocument();
    });
    it("should render application title", () => {
      renderComponent();

      const title = screen.getByRole("heading", { level: 1, name: "Ulkoliikuntakartta" });

      expect(title).toBeInTheDocument();
    });
  });
  describe("language controls", () => {
    it("should apply lang attribute to language controls", () => {
      renderComponent();

      const swedishLink = screen.getByAltText("Svenska").parentElement;
      const englishLink = screen.getByAltText("English").parentElement;

      expect(swedishLink?.getAttribute("lang")).toEqual("sv");
      expect(englishLink?.getAttribute("lang")).toEqual("en");
    });
  });
});
