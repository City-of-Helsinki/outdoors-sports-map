import userEvent from "@testing-library/user-event";

import { render, screen } from "../../testingLibraryUtils";
import { Unit } from "../../unit/unitConstants";
import SearchSuggestions, { Suggestion } from "../SearchSuggestions";

jest.mock("../../unit/UnitIcon", () => {
  return function MockUnitIcon({ unit }: any) {
    return <div data-testid="unit-icon">{unit?.name || "Unit Icon"}</div>;
  };
});

jest.mock("../../unit/UnitObservationStatus", () => {
  return function MockObservationStatus({ unit }: any) {
    return <div data-testid="observation-status">{unit?.name} Status</div>;
  };
});

const mockPreventBlurClose = { current: false };

const defaultProps = {
  openAllResults: jest.fn(),
  handleAddressClick: jest.fn(),
  suggestions: [] as Suggestion[],
  menuPosition: { top: 100 },
  preventBlurClose: mockPreventBlurClose,
};

const mockUnit: Unit = {
  id: "123",
  name: "Test Unit",
  municipality: "Helsinki",
  street_address: "Test Street 1",
  phone: "123456789",
  description: "Test description",
  picture_url: "https://test.com/image.jpg",
  location: {
    coordinates: [24.9458, 60.1695],
  },
  services: [],
  connections: [],
} as unknown as Unit;

const mockSuggestions: Suggestion[] = [
  {
    type: "searchable",
    label: "Helsinki",
    coordinates: [24.9458, 60.1695],
    to: "/search?q=Helsinki",
  },
  {
    type: "searchable",
    label: "Espoo",
    coordinates: [24.6522, 60.2055],
    to: "/search?q=Espoo",
  },
  {
    type: "loose",
    label: "Test Unit",
    unit: mockUnit,
    to: "/unit/123",
  },
  {
    type: "searchable",
    label: "Custom Icon Place",
    icon: "https://example.com/icon.png",
    coordinates: [24.9458, 60.1695],
  },
];

const renderComponent = (props = {}) =>
  render(<SearchSuggestions {...defaultProps} {...props} />);

describe("<SearchSuggestions />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPreventBlurClose.current = false;
  });

  describe("rendering", () => {
    it("should render with proper positioning", () => {
      renderComponent({
        suggestions: mockSuggestions.slice(0, 1),
        menuPosition: { top: 150 },
      });

      const container = screen.getByTestId("search-suggestions");
      expect(container).toBeInTheDocument();
      expect(container).toHaveStyle({
        position: "fixed",
        top: "150px",
        zIndex: "799",
      });
    });

    it("should not render anything when there are no suggestions", () => {
      renderComponent({ suggestions: [] });

      const list = screen.queryByTestId("suggestions-list");
      expect(list).not.toBeInTheDocument();
    });

    it("should render suggestion list when suggestions exist", () => {
      renderComponent({ suggestions: mockSuggestions.slice(0, 1) });

      const list = screen.getByTestId("suggestions-list");
      expect(list).toBeInTheDocument();
    });
  });

  describe("show all results button", () => {
    it("should render 'show all results' button when there are searchable suggestions", () => {
      const searchableSuggestions = mockSuggestions.filter(
        (s) => s.type === "searchable",
      );
      renderComponent({ suggestions: searchableSuggestions });

      const showAllButton = screen.getByText("Näytä kaikki hakutulokset");
      expect(showAllButton).toBeInTheDocument();
    });

    it("should not render 'show all results' button when there are no searchable suggestions", () => {
      const looseSuggestions = mockSuggestions.filter(
        (s) => s.type === "loose",
      );
      renderComponent({ suggestions: looseSuggestions });

      const showAllButton = screen.queryByText("Näytä kaikki hakutulokset");
      expect(showAllButton).not.toBeInTheDocument();
    });

    it("should call openAllResults when 'show all results' button is clicked", async () => {
      const openAllResults = jest.fn();
      const searchableSuggestions = mockSuggestions.filter(
        (s) => s.type === "searchable",
      );

      renderComponent({
        suggestions: searchableSuggestions,
        openAllResults,
      });

      const showAllButton = screen.getByText("Näytä kaikki hakutulokset");
      await userEvent.click(showAllButton);

      expect(openAllResults).toHaveBeenCalledTimes(1);
    });
  });

  describe("suggestion items", () => {
    it("should render all suggestion items", () => {
      renderComponent({ suggestions: mockSuggestions });

      expect(screen.getByText("Helsinki")).toBeInTheDocument();
      expect(screen.getByText("Espoo")).toBeInTheDocument();
      // Test Unit appears twice (in icon and text), so use getAllByText
      expect(screen.getAllByText("Test Unit")).toHaveLength(2);
      expect(screen.getByText("Custom Icon Place")).toBeInTheDocument();
    });

    it("should render suggestions as links with correct href", () => {
      renderComponent({ suggestions: mockSuggestions });

      const helsinkiLink = screen.getByRole("link", { name: /Helsinki/i });
      expect(helsinkiLink).toHaveAttribute("href", "/fi/search?q=Helsinki");

      const unitLink = screen.getByRole("link", { name: /Test Unit/i });
      expect(unitLink).toHaveAttribute("href", "/fi/unit/123");
    });

    it("should render suggestion with unit icon", () => {
      renderComponent({ suggestions: [mockSuggestions[2]] });

      const unitIcon = screen.getByTestId("unit-icon");
      expect(unitIcon).toBeInTheDocument();
      expect(unitIcon).toHaveTextContent("Test Unit");
    });

    it("should render suggestion with custom icon", () => {
      renderComponent({ suggestions: [mockSuggestions[3]] });

      // Images with empty alt have presentation role, not img role
      const customIcon = screen.getByRole("presentation");
      expect(customIcon).toBeInTheDocument();
      expect(customIcon).toHaveAttribute("src", "https://example.com/icon.png");
      expect(customIcon).toHaveAttribute("height", "21px");
      expect(customIcon).toHaveAttribute("alt", "");
    });

    it("should render observation status for unit suggestions", () => {
      renderComponent({ suggestions: [mockSuggestions[2]] });

      const observationStatus = screen.getByTestId("observation-status");
      expect(observationStatus).toBeInTheDocument();
      expect(observationStatus).toHaveTextContent("Test Unit Status");
    });
  });

  describe("address click handling", () => {
    it("should call handleAddressClick when suggestion with coordinates is clicked", async () => {
      const handleAddressClick = jest.fn();
      renderComponent({
        suggestions: [mockSuggestions[0]], // Helsinki with coordinates
        handleAddressClick,
      });

      const helsinkiLink = screen.getByRole("link", { name: /Helsinki/i });
      await userEvent.click(helsinkiLink);

      expect(handleAddressClick).toHaveBeenCalledWith([24.9458, 60.1695]);
    });

    it("should prevent default navigation when suggestion with coordinates is clicked", async () => {
      const handleAddressClick = jest.fn();
      renderComponent({
        suggestions: [mockSuggestions[0]], // Helsinki with coordinates
        handleAddressClick,
      });

      const helsinkiLink = screen.getByRole("link", { name: /Helsinki/i });
      const preventDefaultSpy = jest.fn();

      helsinkiLink.addEventListener("click", (e) => {
        e.preventDefault = preventDefaultSpy;
      });

      await userEvent.click(helsinkiLink);

      expect(handleAddressClick).toHaveBeenCalledWith([24.9458, 60.1695]);
    });

    it("should not call handleAddressClick when suggestion without coordinates is clicked", async () => {
      const handleAddressClick = jest.fn();
      const unitSuggestion = { ...mockSuggestions[2] };
      delete unitSuggestion.coordinates;

      renderComponent({
        suggestions: [unitSuggestion],
        handleAddressClick,
      });

      const unitLink = screen.getByRole("link", { name: /Test Unit/i });
      await userEvent.click(unitLink);

      expect(handleAddressClick).not.toHaveBeenCalled();
    });
  });

  describe("preventBlurClose behavior", () => {
    it("should set preventBlurClose to true on mouseDown", async () => {
      renderComponent({ suggestions: mockSuggestions.slice(0, 1) });

      const container = screen.getByTestId("search-suggestions");
      expect(mockPreventBlurClose.current).toBe(false);

      await userEvent.pointer([{ target: container, keys: "[MouseLeft>]" }]);

      expect(mockPreventBlurClose.current).toBe(true);
    });

    it("should set preventBlurClose to true on touchStart", () => {
      renderComponent({ suggestions: mockSuggestions.slice(0, 1) });

      const container = screen.getByTestId("search-suggestions");
      expect(mockPreventBlurClose.current).toBe(false);

      if (container) {
        container.dispatchEvent(
          new TouchEvent("touchstart", { bubbles: true }),
        );
      }

      expect(mockPreventBlurClose.current).toBe(true);
    });
  });

  describe("suggestion filtering", () => {
    it("should correctly count searchable suggestions", () => {
      const mixedSuggestions = [
        { type: "searchable" as const, label: "Search 1", coordinates: [1, 1] },
        { type: "loose" as const, label: "Loose 1", unit: mockUnit },
        { type: "searchable" as const, label: "Search 2", coordinates: [2, 2] },
      ];

      renderComponent({ suggestions: mixedSuggestions });

      // Should show 'show all results' button because there are searchable suggestions
      expect(screen.getByText("Näytä kaikki hakutulokset")).toBeInTheDocument();
      expect(screen.getByText("Search 1")).toBeInTheDocument();
      expect(screen.getByText("Loose 1")).toBeInTheDocument();
      expect(screen.getByText("Search 2")).toBeInTheDocument();
    });
  });
});
