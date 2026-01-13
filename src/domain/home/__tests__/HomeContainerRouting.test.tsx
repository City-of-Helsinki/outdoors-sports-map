import { MemoryRouter } from "react-router-dom";

import { render, screen } from "../../testingLibraryUtils";
import HomeContainer from "../HomeContainer";

// Mock the complex dependencies
jest.mock("../useFetchInitialData", () => jest.fn());
jest.mock("../../map/MapComponent", () => {
  return function MockMapComponent() {
    return <div data-testid="map-component">Map Component</div>;
  };
});
jest.mock("../../unit/browser/UnitBrowser", () => {
  return function MockUnitBrowser() {
    return <div data-testid="unit-browser">Unit Browser</div>;
  };
});
jest.mock("../../unit/details/UnitDetails", () => {
  return function MockUnitDetails() {
    return <div data-testid="unit-details">Unit Details</div>;
  };
});
jest.mock("../../app/CookieConsent", () => {
  return function MockCookieConsent() {
    return null;
  };
});

// Mock hooks to avoid complex setup
jest.mock("../../../common/hooks/useIsMobile", () => jest.fn(() => false));

const renderWithRoute = (initialEntries: string[]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <HomeContainer />
    </MemoryRouter>
  );
};

describe("HomeContainer Routing Integration", () => {
  describe("valid routes", () => {
    it("should show UnitBrowser for root language route", () => {
      renderWithRoute(["/fi"]);

      expect(screen.getByTestId("unit-browser")).toBeInTheDocument();
      expect(screen.queryByText("404")).not.toBeInTheDocument();
    });

    it("should show UnitBrowser for search route", () => {
      renderWithRoute(["/fi/search"]);

      expect(screen.getByTestId("unit-browser")).toBeInTheDocument();
      expect(screen.queryByText("404")).not.toBeInTheDocument();
    });

    it("should show UnitDetails for unit detail route", () => {
      renderWithRoute(["/fi/unit/123"]);

      expect(screen.getByTestId("unit-details")).toBeInTheDocument();
      expect(screen.queryByText("404")).not.toBeInTheDocument();
    });

    it("should work with Swedish language routes", () => {
      renderWithRoute(["/sv"]);
      expect(screen.getByTestId("unit-browser")).toBeInTheDocument();
      expect(screen.queryByText("404")).not.toBeInTheDocument();
    });

    it("should work with English language routes", () => {
      renderWithRoute(["/en/search"]);
      expect(screen.getByTestId("unit-browser")).toBeInTheDocument();
      expect(screen.queryByText("404")).not.toBeInTheDocument();
    });

    it("should work with UnitDetails in Swedish", () => {
      renderWithRoute(["/sv/unit/456"]);
      expect(screen.getByTestId("unit-details")).toBeInTheDocument();
      expect(screen.queryByText("404")).not.toBeInTheDocument();
    });


  });

  describe("invalid routes - should show NotFound", () => {
    it.each([
      "/fi/invalid-path",
      "/fi/random-stuff/more-stuff",
      "/sv/invalid",
      "/en/invalid",
      "/fi/definitely/not/a/real/route"
    ])("should show NotFound for %s", (path) => {
      renderWithRoute([path]);

      expect(screen.getByText("404")).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /sivua ei löytynyt/i })).toBeInTheDocument();
      expect(screen.queryByTestId("unit-browser")).not.toBeInTheDocument();
      expect(screen.queryByTestId("unit-details")).not.toBeInTheDocument();
    });
  });

  describe("route precedence", () => {
    it("should match exact routes before catch-all NotFound", () => {
      renderWithRoute(["/fi/"]);
      
      // Should match exact unitBrowser route, not NotFound
      expect(screen.getByTestId("unit-browser")).toBeInTheDocument();
      expect(screen.queryByText("404")).not.toBeInTheDocument();
    });

    it("should show NotFound as final fallback", () => {
      renderWithRoute(["/fi/this-route-definitely-does-not-exist"]);

      expect(screen.getByText("404")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /palaa etusivulle/i })).toBeInTheDocument();
    });
  });
});